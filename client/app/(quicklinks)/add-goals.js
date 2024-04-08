import { View, Text, Pressable, Linking } from "react-native";
import { Link, router, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
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
import { AddGoal, UpdateGoal } from "../../api";
import moment from "moment";
import Toast from "react-native-toast-message";

const Container = styled.View`
  flex: 1;
  gap: 22px;
  padding: 42px 16px 16px 16px;
  background-color: ${({ theme }) => theme.bg};
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
  text-align: center;
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.text_primary};
`;

const UPIID = styled.Text`
  width: fit-content;
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.text_primary};
  padding: 6px 10px;
  border-radius: 8px;
  background: ${({ theme }) => theme.text_secondary + 10};
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

export default function AddGoals() {
  const { updateGoals, edit } = useLocalSearchParams();
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
      if (edit) {
        await UpdateGoal(
          JSON.parse(updateGoals)?.id,
          goalData,
          currentUser?.token
        )
          .then(async (res) => {
            console.log(res);
            Toast.show({
              type: "success",
              text1: "Goal Updated",
              text2: "Goal Updated successfully 👋",
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
      } else {
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
    }
  };

  useEffect(() => {
    if (edit) {
      setGoalData(JSON.parse(updateGoals));
    }
  }, []);

  return (
    <>
      <Container>
        <Back onPress={() => router.replace("/home")}>
          <Ionicons name="chevron-back" size={22} color={theme.text_primary} />
        </Back>
        <Toast />
        <ScrollView>
          <Title>Create New Goal 🎯</Title>
          <Wrapper>
            <View
              style={{
                gap: 10,
              }}
            >
              <InputText
                startIcon={
                  <MaterialCommunityIcons
                    name="bullseye-arrow"
                    size={24}
                    color={theme.text_secondary}
                  />
                }
                value={goalData.name}
                onChangeText={handleInputChange}
                placeholder="Enter Goal Title"
                label="Goal Title"
                name="name"
                type={"default"}
              />
              <InputText
                startIcon={
                  <MaterialCommunityIcons
                    name="notebook-edit"
                    size={24}
                    color={theme.text_secondary}
                  />
                }
                value={goalData.description}
                onChangeText={handleInputChange}
                placeholder="Enter Goal Short Description"
                label="Goal Description"
                name="description"
                type={"default"}
              />
              <DateInput
                startIcon={
                  <Icon
                    name="calendar-month-outline"
                    size={24}
                    color={theme.text_secondary}
                  />
                }
                value={goalData.target_date}
                onChange={(date, name) =>
                  setGoalData({
                    ...goalData,
                    target_date: date,
                  })
                }
                label="Target Date"
                placeholder="Goal Completion Date"
                name="target_date"
              />
              <InputText
                startIcon={
                  <FontAwesome
                    name="rupee"
                    size={22}
                    color={theme.text_secondary}
                    style={{
                      marginRight: 5,
                      marginLeft: 5,
                    }}
                  />
                }
                value={goalData.target_amount}
                onChangeText={handleInputChange}
                placeholder="Enter Target Amount"
                label="Target Amount"
                name="target_amount"
                type={"numeric"}
              />
              <SelectagleItem>
                <InputName>Priority Level</InputName>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  {PriorityList.map((priorityItem, index) => (
                    <SelectableChip
                      key={`priorityItem-${index}`}
                      flex
                      selected={priorityItem.value === goalData.priority_level}
                      onPress={() =>
                        setGoalData({
                          ...goalData,
                          priority_level: priorityItem.value,
                        })
                      }
                      startIcon={priorityItem.icon}
                      color={priorityItem.color}
                    >
                      {priorityItem.label}
                    </SelectableChip>
                  ))}
                </View>
              </SelectagleItem>
            </View>
          </Wrapper>
        </ScrollView>

        <Button
          type="filled"
          color={theme.white}
          bgcolor={theme.primary}
          loading={loading}
          onPress={() => handelAddGoal()}
          disabled={
            goalData.target_amount === "" ||
            goalData.target_date === "" ||
            goalData.priority_level === "" ||
            goalData.name === "" ||
            goalData.description === ""
          }
        >
          Continue
        </Button>
      </Container>
    </>
  );
}
