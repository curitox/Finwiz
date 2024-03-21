import React, { useEffect, useState } from "react";
import { View, StatusBar } from "react-native";
import InputText from "../../components/text_fields/inputText";
import Button from "../../components/buttons/button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styled, { useTheme } from "styled-components/native";
import { useThemeContext } from "../../context/themeContext";
import DateInput from "../../components/text_fields/dateInput";
import SelectableChip from "../../components/selectable/SelectableChip";
import { useAuthContext } from "../../context/auth";
import { UserProfileCreate } from "../../api";
import Toast from "react-native-toast-message";

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

const SelectagleItem = styled.View`
  flex-direction: column;
  padding: 4px 4px;
  gap: 8px;
`;

const InputName = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;

const IconContainer = styled.View`
  padding: 0px 6px;
`;

const ProfileCreate = () => {
  const theme = useTheme();
  const themeMode = useThemeContext();
  const { signIn, currentUser } = useAuthContext();
  const { toggleTheme } = useThemeContext();
  const options = {
    gender: [
      {
        value: "Male",
        icon: "mars",
      },
      {
        value: "Female",
        icon: "venus",
      },
      {
        value: "Other",
        icon: "transgender",
      },
    ],
    financialKnowledge: ["📚 Beginner", "📊 Intermediate", "📈 Advances"],
    riskTolerance: ["🐢 Conservative", "🐇 Moderate", "🚀 Aggressive"],
  };
  const [user, setUser] = useState({
    dob: "",
    monthlyIncome: "",
    gender: "",
    riskTolerance: "",
    financialKnowledge: "",
  });
  const [error, setError] = useState({
    dob: "",
    monthlyIncome: "",
    gender: "",
    riskTolerance: "",
    financialKnowledge: "",
  });
  const [loading, setLoading] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const handleInputChange = (value, name) => {
    // validation checks
    setUser({ ...user, [name]: value });
  };

  useEffect(() => {
    // If there is no error message and all the fields are filled, then enable the button
    if (
      !error.dob &&
      !error.monthlyIncome &&
      !error.financialKnowledge &&
      !error.gender &&
      !error.riskTolerance &&
      user.dob &&
      user.financialKnowledge &&
      user.riskTolerance &&
      user.monthlyIncome &&
      user.gender
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [error, user]);

  const handelProfileCreate = async () => {
    setLoading(true);
    await UserProfileCreate(user, currentUser?.token)
      .then((res) => {
        signIn({ token: currentUser?.token, user: res?.data?.user });
        Toast.show({
          type: "success",
          text1: "Profile created",
          text2: "Profile created successfully 👋",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: err.response.data.message,
        });
        setLoading(false);
      });
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
        <HeadingText>Profile Creation 🙋🏻</HeadingText>
        <SubHeadingText>Few Details about you and good to go!</SubHeadingText>
      </View>
      <View
        style={{
          flex: 1,
          padding: 16,
          gap: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            gap: 10,
          }}
        >
          <DateInput
            startIcon={
              <Icon
                name="calendar-month-outline"
                size={24}
                color={theme.text_secondary}
              />
            }
            value={user.dob}
            onChange={(date, name) => setUser({ ...user, dob: date })}
            label="Date of Birth"
            placeholder="Enter your date of birth"
            name="dob"
            error={error.dob}
          />
          <InputText
            startIcon={
              <IconContainer>
                <FontAwesome
                  name="inr"
                  size={22}
                  color={theme.text_secondary}
                />
              </IconContainer>
            }
            value={user.monthlyIncome}
            onChangeText={handleInputChange}
            placeholder="Enter your monthly income"
            label="Monthly Income"
            name="monthlyIncome"
            type={"numeric"}
            error={error.monthlyIncome}
          />

          <SelectagleItem>
            <InputName>Gender</InputName>
            <View
              style={{
                flex: 1,
                gap: 8,
                flexDirection: "row",
              }}
            >
              {options.gender.map((gender, index) => (
                <SelectableChip
                  key={`gender-${index}`}
                  startIcon={gender.icon}
                  selected={gender.value === user.gender}
                  onPress={() => setUser({ ...user, gender: gender.value })}
                >
                  {gender.value}
                </SelectableChip>
              ))}
            </View>
          </SelectagleItem>
          <SelectagleItem>
            <InputName>Financial Knowledge</InputName>
            <View
              style={{
                flex: 1,
                gap: 8,
                flexDirection: "row",
              }}
            >
              {options.financialKnowledge.map((financialKnowledge, index) => (
                <SelectableChip
                  key={`financialKnowledge-${index}`}
                  selected={financialKnowledge === user.financialKnowledge}
                  onPress={() =>
                    setUser({
                      ...user,
                      financialKnowledge: financialKnowledge,
                    })
                  }
                >
                  {financialKnowledge}
                </SelectableChip>
              ))}
            </View>
          </SelectagleItem>
          <SelectagleItem>
            <InputName>Risk Tolerance</InputName>
            <View
              style={{
                flex: 1,
                gap: 8,
                flexDirection: "row",
              }}
            >
              {options.riskTolerance.map((riskTolerance, index) => (
                <SelectableChip
                  key={`riskTolerance-${index}`}
                  selected={riskTolerance === user.riskTolerance}
                  onPress={() =>
                    setUser({
                      ...user,
                      riskTolerance: riskTolerance,
                    })
                  }
                >
                  {riskTolerance}
                </SelectableChip>
              ))}
            </View>
          </SelectagleItem>
        </View>

        <Button
          type="filled"
          color={theme.white}
          bgcolor={theme.primary}
          loading={loading}
          onPress={handelProfileCreate}
          disabled={buttonDisabled}
        >
          Continue
        </Button>
      </View>
      <Toast />
    </Wrapper>
  );
};

export default ProfileCreate;
