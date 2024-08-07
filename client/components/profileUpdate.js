import React, { useEffect, useState } from "react";
import { View, StatusBar } from "react-native";
import InputText from "./text_fields/inputText";
import Button from "./buttons/button";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styled, { useTheme } from "styled-components/native";
import { useThemeContext } from "../context/themeContext";
import DateInput from "./text_fields/dateInput";
import SelectableChip from "./selectable/SelectableChip";
import { useAuthContext } from "../context/auth";
import { UserProfileCreate } from "../api";
import Toast from "react-native-toast-message";
import { useBottomSheetContext } from "../context/bottomSheetContext";
import moment from "moment";

const SelectagleItem = styled.View`
  flex-direction: column;
  padding: 4px 4px;
  gap: 8px;
`;

const Title = styled.Text`
  text-align: center;
  font-size: 20px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const InputName = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;

const IconContainer = styled.View`
  padding: 0px 6px;
`;

const ProfileUpdate = () => {
  const { setOpenBottomSheet } = useBottomSheetContext();
  const theme = useTheme();
  const themeMode = useThemeContext();
  const { signIn, currentUser } = useAuthContext();
  const options = {
    gender: [
      {
        value: "MALE",
        icon: "mars",
      },
      {
        value: "FEMALE",
        icon: "venus",
      },
      {
        value: "OTHER",
        icon: "transgender",
      },
    ],
    financialKnowledge: [
      {
        value: "BEGINNER",
        icon: "📚 Beginner",
      },
      {
        value: "INTERMEDIATE",
        icon: "📊 Intermediate",
      },
      {
        value: "ADVANCED",
        icon: "📈 Advances",
      },
    ],
    riskTolerance: [
      {
        value: "CONSERVATIVE",
        icon: "🐢 Conservative",
      },
      {
        value: "MODERATE",
        icon: "🐇 Moderate",
      },
      {
        value: "AGGRESSIVE",
        icon: "🚀 Aggressive",
      },
    ],
  };
  const [user, setUser] = useState({
    ...currentUser?.user,
    dob: moment(currentUser?.user?.dob).format("YYYY-MM-DD"),
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
        alert("Profile Updated Successfully");
        setLoading(false);
        setOpenBottomSheet({
          open: false,
          content: null,
        });
      })
      .catch((err) => {
        console.log(err.response.data.message);
        alert(err.response.data.message);
        setLoading(false);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        paddingTop: 2,
        gap: 16,
        justifyContent: "center",
      }}
    >
      <Title>Update Profile</Title>
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
          small
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
              <FontAwesome name="inr" size={22} color={theme.text_secondary} />
            </IconContainer>
          }
          small
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
                flex
                key={`gender-${index}`}
                startIconText={gender.icon}
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
                flex
                key={`financialKnowledge-${index}`}
                selected={financialKnowledge.value === user.financialKnowledge}
                onPress={() =>
                  setUser({
                    ...user,
                    financialKnowledge: financialKnowledge.value,
                  })
                }
              >
                {financialKnowledge.icon}
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
                flex
                key={`riskTolerance-${index}`}
                selected={riskTolerance.value === user.riskTolerance}
                onPress={() =>
                  setUser({
                    ...user,
                    riskTolerance: riskTolerance.value,
                  })
                }
              >
                {riskTolerance.value}
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
        Update
      </Button>
    </View>
  );
};

export default ProfileUpdate;
