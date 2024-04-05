import { View, Text, Pressable, Linking } from "react-native";
import { Link, router, useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuthContext } from "../../context/auth";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import InputText from "../../components/text_fields/inputText";
import Button from "../../components/buttons/button";
import DateInput from "../../components/text_fields/dateInput";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SelectableChip from "../../components/selectable/SelectableChip";
import { AddGoal } from "../../api";
import moment from "moment";
import Toast from "react-native-toast-message";
import ExpencePredictionCard from "../../components/cards/ExpencePredictionCard";

const Container = styled.ScrollView`
  flex: 1;
  gap: 12px;
  padding: 42px 16px 16px 16px;
`;
const Back = styled.TouchableOpacity`
  width: 46px;
  height: 46px;
  border-radius: 46px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.text_secondary + 20};
`;
const Title = styled.Text`
  font-weight: 600;
  font-size: 24px;
  margin-top: 12px;
  color: ${({ theme }) => theme.text_primary};
`;

const Wrapper = styled.View`
  flex: 1;
  justify-content: space-between;
  padding: 18px 0px 8px 0px;
  gap: 22px;
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

export default function AIinsights() {
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState();
  const { currentUser } = useAuthContext();

  const PriorityList = [
    {
      label: "🔴 High",
      value: "HIGH",
    },
    {
      label: "🟡 Medium",
      value: "MEDIUM",
    },
    {
      label: "🟢 Low",
      value: "LOW",
    },
  ];

  const [goalData, setGoalData] = useState({
    name: "",
    description: "",
    target_amount: "",
    target_date: moment().format("YYYY-MM-DD"),
    priority_level: "",
    status: "IN_PROGRESS",
  });

  const handleInputChange = (value, name) => {
    setGoalData({ ...goalData, [name]: value });
  };

  const handelAddGoal = async () => {
    if (
      goalData.target_amount !== "" &&
      goalData.target_date !== "" &&
      goalData.priority_level !== "" &&
      goalData.name !== "" &&
      goalData.description !== ""
    ) {
      setLoading(true);
      await AddGoal(goalData, currentUser?.token)
        .then(async (res) => {
          console.log(res);
          Toast.show({
            type: "success",
            text1: "New Goal Created",
            text2: "New Goal created successfully 👋",
          });
          setLoading(false);
          router.replace("/home");
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
    }
  };

  return (
    <>
      <Container>
        <Back onPress={() => router.replace("/home")}>
          <Ionicons name="chevron-back" size={22} color={theme.text_primary} />
        </Back>
        <Toast />
        <Title>AI Insights</Title>
        <Wrapper>
          <View
            style={{
              gap: 10,
            }}
          >
            <ExpencePredictionCard />
          </View>
        </Wrapper>
      </Container>
    </>
  );
}
