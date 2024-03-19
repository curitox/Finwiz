import React, { useEffect, useState } from "react";
import { View, Text, StatusBar } from "react-native";
import InputText from "./text_fields/inputText";
import Button from "./buttons/button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled, { useTheme } from "styled-components/native";
import TextButton from "./buttons/textButton";
import { useThemeContext } from "../context/themeContext";
import { router } from "expo-router";
import { OtpInput } from "react-native-otp-entry";

const Wrapper = styled.ScrollView`
  flex: 1;
  padding: 80px 0px;
  background-color: ${({ theme }) => theme.bg};
`;

const Logo = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  padding: 14px 0px;
`;

const Resend = styled.View`
  flex-direction: row;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

const HeadingText = styled.Text`
  font-size: 30px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const SubHeadingText = styled.Text`
  font-size: 14px;
  font-weight: 400;
  margin-top: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;

const OtpVerify = ({ emailId }) => {
  const theme = useTheme();
  const themeMode = useThemeContext();
  const { toggleTheme } = useThemeContext();
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(true);

  const handleInputChange = (value, name) => {
    // validation checks
    if (name === "email") {
      // Email validation regex pattern
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!value) {
        setButtonDisabled(true);
      }

      if (value && !emailRegex.test(value)) {
        setError({
          ...error,
          email: "Enter correct email format",
        });
        setButtonDisabled(true);
      } else {
        setError({
          ...error,
          email: "",
        });
      }
    }

    if (name === "password") {
      if (!value) {
        setButtonDisabled(true);
      }
      // Password validation regex pattern
      if (value && value.length < 8) {
        setError({
          ...error,
          password: "Password must be atleast 8 characters long!",
        });
        setButtonDisabled(true);
      } else if (value && value.length > 16) {
        setError({
          ...error,
          password: "Password must be less than 16 characters long!",
        });
        setButtonDisabled(true);
      } else if (
        value &&
        (!value.match(/[a-z]/g) ||
          !value.match(/[A-Z]/g) ||
          !value.match(/[0-9]/g) ||
          !value.match(/[^a-zA-Z\d]/g))
      ) {
        setError({
          ...error,
          password:
            "Password must contain atleast one lowercase, uppercase, number and special character!",
        });
        setButtonDisabled(true);
      } else {
        setError({
          ...error,
          password: "",
        });
      }
    }

    if (name === "confirmPassword") {
      if (!value) {
        setButtonDisabled(true);
      }
      if (value && value !== user.password) {
        setError({
          ...error,
          confirmPassword: "Passwords do not match!",
        });
        setButtonDisabled(true);
      } else {
        setError({
          ...error,
          confirmPassword: "",
        });
      }
    }

    setUser({ ...user, [name]: value });
  };

  useEffect(() => {
    // If there is no error message and all the fields are filled, then enable the button
    if (
      !error.email &&
      !error.password &&
      !error.confirmPassword &&
      user.email &&
      user.password &&
      user.confirmPassword &&
      user.password === user.confirmPassword
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [error, user]);

  const handleOtpVerify = () => {
    toggleTheme();
    setLoading(true);
  };

  return (
    <Wrapper>
      <StatusBar
        barStyle={
          themeMode.theme === "light" ? "dark-content" : "light-content"
        }
        backgroundColor={theme.bg} // Set the status bar color based on the theme
      />
      <View
        style={{
          flex: 1,
          padding: 16,
          gap: 4,
        }}
      >
        <Logo>Finwiz</Logo>
        <HeadingText>Verify OTP 📩💬</HeadingText>
        <SubHeadingText>
          An OTP has been sent to your email id:{" "}
          <TextButton
            label={emailId}
            color={theme.primary}
            disabled={true}
            enabled={false}
          />
        </SubHeadingText>
      </View>
      <View
        style={{
          flex: 1,
          padding: 16,
          gap: 42,
        }}
      >
        <View
          style={{
            flex: 1,
            gap: 16,
          }}
        >
          <OtpInput
            numberOfDigits={6}
            focusColor={theme.primary}
            focusStickBlinkingDuration={500}
            onTextChange={(text) => console.log(text)}
            onFilled={(text) => console.log(`OTP is ${text}`)}
            // theme={{
            //   containerStyle: styles.container,
            //   inputsContainerStyle: styles.inputsContainer,
            //   pinCodeContainerStyle: styles.pinCodeContainer,
            //   pinCodeTextStyle: styles.pinCodeText,
            //   focusStickStyle: styles.focusStick,
            //   focusedPinCodeContainerStyle: styles.activePinCodeContainer,
            // }}
          />
          <Resend>
            <Text>Resend in 00:59 </Text>
            <TextButton
              label="Resend"
              color={theme.primary}
              disabled={false}
              enabled={true}
              onPress={() => router.replace("/sign-in")}
            />
          </Resend>
        </View>

        <Button
          type="filled"
          color={theme.white}
          bgcolor={theme.primary}
          loading={loading}
          onPress={handleOtpVerify}
          disabled={buttonDisabled}
        >
          Verify OTP
        </Button>
      </View>
    </Wrapper>
  );
};

export default OtpVerify;
