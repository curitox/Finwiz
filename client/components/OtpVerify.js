import React, { useEffect, useRef, useState } from "react";
import { View, Text, StatusBar, Dimensions } from "react-native";
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
  padding: 80px 16px;
  background-color: ${({ theme }) => theme.bg};
`;

const Logo = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
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
  color: ${({ theme }) => theme.text_secondary};
`;

const OtpVerify = ({ emailId, setShowOtp }) => {
  const theme = useTheme();
  const themeMode = useThemeContext();
  const { toggleTheme } = useThemeContext();
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timer, setTimer] = useState("00:00");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleOtpVerify = () => {
    toggleTheme();
    setLoading(true);
  };

  const sendOtp = async () => {
    console.log("sent");
  };

  const Ref = useRef(null);

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      // update the timer
      // check if less than 10 then we need to
      // add '0' at the beginning of the variable
      setTimer(
        (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };

  const clearTimer = (e) => {
    // If you adjust it you should also need to
    // adjust the Endtime formula we are about
    // to code next
    setTimer("01:00");

    // If you try to remove this line the
    // updating of timer Variable will be
    // after 1000ms or 1sec
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();

    // This is where you need to adjust if
    // you entend to add more time
    deadline.setSeconds(deadline.getSeconds() + 60);
    return deadline;
  };

  const resendOtp = () => {
    setShowTimer(true);
    clearTimer(getDeadTime());
    sendOtp();
  };

  useEffect(() => {
    sendOtp();
    clearTimer(getDeadTime());
  }, []);

  useEffect(() => {
    if (timer === "00:00") {
      setShowTimer(false);
    } else {
      setShowTimer(true);
    }
  }, [timer]);

  useEffect(() => {
    if (otp.length === 6) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [otp]);

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
          gap: 22,
          paddingTop: 16,
        }}
      >
        <Logo>Finwiz</Logo>
        <HeadingText>Verify OTP 📩💬</HeadingText>

        <View
          style={{
            flex: 1,
            gap: 2,
          }}
        >
          <SubHeadingText>
            An OTP has been sent to your email id:
          </SubHeadingText>
          <TextButton
            label={emailId}
            color={theme.primary}
            disabled={true}
            enabled={false}
          />
        </View>

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
          />
          <Resend>
            {showTimer ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                <Text>Resend in</Text>
                <TextButton
                  label={timer}
                  color={theme.primary}
                  disabled={true}
                  enabled={true}
                />
              </View>
            ) : (
              <TextButton
                label="Resend"
                color={theme.primary}
                disabled={false}
                enabled={true}
                onPress={() => resendOtp()}
              />
            )}
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
