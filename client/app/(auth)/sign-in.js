import React, { useEffect, useState } from "react";
import { View, Text, StatusBar } from "react-native";
import InputText from "../../components/text_fields/inputText";
import Button from "../../components/buttons/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled, { useTheme } from "styled-components/native";
import { Image } from "react-native-elements";
import TextButton from "../../components/buttons/textButton";
import { useThemeContext } from "../../context/themeContext";
import { router, useRouter } from "expo-router";
import { UserSignIn } from "../../api/index";
import Toast from "react-native-toast-message";
import { useAuthContext } from "../../context/auth";

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

const Verified = styled.View`
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  background-color: #27ae60;
  height: 18px;
  width: 18px;
`;

const HeadingText = styled.Text`
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const SubHeadingText = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;

const ForgotButton = styled.View`
  justify-content: flex-end;
  align-items: flex-end;
  padding: 0px 8px;
`;

const Seperator = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 50px;
  gap: 12px;
`;

const Hr = styled.View`
  height: 1px;
  width: 30%;
  background-color: ${({ theme }) => theme.text_secondary_light};
`;

const OrText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;

const SocialAuth = styled.View`
  flex-direction: row;
  width: 100%;
  gap: 8px;
`;

const AlreadyAccount = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 8px;
`;

const Txt = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;

const SignIn = () => {
  const theme = useTheme();
  const router = useRouter();
  const themeMode = useThemeContext();
  const { toggleTheme } = useThemeContext();
  const { signIn, currentUser } = useAuthContext();
  const [user, setUser] = useState({
    email: "",
    password: "",
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

    setUser({ ...user, [name]: value });
  };

  useEffect(() => {
    // If there is no error message and all the fields are filled, then enable the button
    if (!error.email && !error.password && user.email && user.password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [error, user]);

  const handleSignIn = async () => {
    setLoading(true);
    await UserSignIn(user)
      .then((res) => {
        signIn(res.data);
        if (currentUser?.user?.profileCreated === false) {
          router.replace("/profile-create");
        }
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "LoggedIn successfully 👋",
        });
        setLoading(false);
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: "Wrong Credentials",
          text2: err.response.data.message,
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    if (currentUser && !currentUser?.user?.profileCreated) {
      router.replace("/profile-create");
    }
  }, [currentUser]);

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
        <HeadingText>Sign in to your account</HeadingText>
        <SubHeadingText>
          Welcome Back, Please Enter Your Email Id{" "}
        </SubHeadingText>
      </View>
      <View
        style={{
          flex: 1,
          padding: 16,
          gap: 18,
        }}
      >
        <View
          style={{
            flex: 1,
            gap: 10,
          }}
        >
          <InputText
            startIcon={
              <Icon
                name="email-outline"
                size={24}
                color={theme.text_secondary}
              />
            }
            endIcon={
              !error.email &&
              user.email !== "" && (
                <Verified>
                  <Icon name="check" size={10} color="white" />
                </Verified>
              )
            }
            value={user.email}
            onChangeText={handleInputChange}
            placeholder="Enter email address"
            label="Email Address"
            name="email"
            type={"email-address"}
            error={error.email}
          />
          <InputText
            startIcon={
              <Icon
                name="lock-outline"
                size={24}
                color={theme.text_secondary}
              />
            }
            value={user.password}
            onChangeText={handleInputChange}
            secureTextEntry={!isPasswordVisible}
            placeholder="Enter password"
            label="Password"
            name="password"
            type={"default"}
            error={error.password}
          />
          {/* <TextArea
            label="Description"
            value={description}
            startIcon={<Icon name="lock-outline" size={24} />}
            onChangeText={(text) => setDescription(text)}
            error={error}
            rows={5} // Set the initial number of rows
            placeholder="Enter your description here..."
          />{" "} */}
        </View>
        <ForgotButton>
          <TextButton
            onPress={() => router.replace("/forgot-password")}
            label="Forgot Password?"
            color={theme.primary}
            disabled={false}
            enabled={true}
          />
        </ForgotButton>

        <Button
          type="filled"
          color={theme.white}
          bgcolor={theme.primary}
          loading={loading}
          onPress={handleSignIn}
          disabled={buttonDisabled}
        >
          Continue
        </Button>

        <Seperator>
          <Hr />
          <OrText>Or Continue With</OrText>
          <Hr />
        </Seperator>
        <SocialAuth>
          <Button
            startIcon={
              <Image
                source={require("../../assets/icons/Google.png")}
                style={{ width: 20, height: 20 }}
              />
            }
            type="outlined"
            bordercolor={theme.text_secondary_light}
            color={theme.text_secondary}
            loading={loading}
            // onPress={() => _googlesignIn()}
          >
            SignIn with Google
          </Button>
        </SocialAuth>
        <AlreadyAccount>
          <Txt>Don't have an account on Finwiz? </Txt>
          <TextButton
            label="Sign Up"
            color={theme.primary}
            disabled={false}
            enabled={true}
            onPress={() => router.replace("/sign-up")}
          />
        </AlreadyAccount>
      </View>
      <Toast />
    </Wrapper>
  );
};

export default SignIn;
