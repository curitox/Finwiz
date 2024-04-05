import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import styled, { css, useTheme } from "styled-components/native";
import Button from "../components/buttons/button";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import TransactionsCard from "./cards/Transactions";
import moment from "moment";
import InputText from "./text_fields/inputText";
import DateInput from "./text_fields/dateInput";
import { AddSavingsToGoal, GetGoalSavings } from "../api";
import { useAuthContext } from "../context/auth";
import Toast from "react-native-toast-message";
import Loader from "./Loader";
import { getCategoryByValue } from "../utils/data";

const Card = styled.View`
  flex: 1;
  flex-direction: column;
  padding: 2px 16px 16px 16px;
  gap: 12px;
`;

const IconButton = styled.TouchableOpacity`
  width: 28px;
  height: 28px;
  border-radius: 28px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.bg};
`;

const Title = styled.Text`
  text-align: center;
  font-size: 20px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const Wrapper = styled.View`
  flex: 1;
  gap: 18px;
`;

const DetailsWrapper = styled.View`
  flex-direction: column;
  border-radius: 14px;
  background: ${({ theme }) => theme.text_secondary + 10};
  padding: 16px;
  gap: 14px;
`;

const GoalTitle = styled.Text`
  font-weight: 500;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;
const IconText = styled.View`
  flex-direction: row;
  gap: 6px;
  align-items: center;
`;
const Date = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;
const Span = styled.Text`
  font-weight: 500;
  color: ${({ color }) => color};
`;

const Bottom = styled.View`
  flex: 1;
  gap: 16px;
  align-items: center;
  flex-direction: row;
`;

const Amount = styled.Text`
  font-size: 22px;
  text-align: center;
  font-weight: 700;
  color: ${({ theme }) => theme.green};
`;

const CompletePercent = styled.Text`
  font-weight: 500;
  font-size: 18px;
  color: ${({ theme }) => theme.primary};
`;

const Marker = styled.Text`
  font-weight: 500;
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
`;
const Transactions = styled.View`
  paddingtop: 14px;
  gap: 12px;
  flex-direction: column;
`;

const TransactionCardWrapper = styled.View`
  flex-direction: column;
`;

const TransactionsContent = [
  {
    name: "Savings & Investments",
    color: "#F1948A",
    value: "savings_investments",
    icon: (
      <MaterialCommunityIcons name="piggy-bank" size={24} color="#F1948A" />
    ),
  },
  {
    name: "Savings & Investments",
    color: "#F1948A",
    value: "savings_investments",
    icon: (
      <MaterialCommunityIcons name="piggy-bank" size={24} color="#F1948A" />
    ),
  },
  {
    name: "Savings & Investments",
    color: "#F1948A",
    value: "savings_investments",
    icon: (
      <MaterialCommunityIcons name="piggy-bank" size={24} color="#F1948A" />
    ),
  },
  {
    name: "Savings & Investments",
    color: "#F1948A",
    value: "savings_investments",
    icon: (
      <MaterialCommunityIcons name="piggy-bank" size={24} color="#F1948A" />
    ),
  },
  {
    name: "Savings & Investments",
    color: "#F1948A",
    value: "savings_investments",
    icon: (
      <MaterialCommunityIcons name="piggy-bank" size={24} color="#F1948A" />
    ),
  },
];

const GoalsDetails = ({ item }) => {
  const { currentUser } = useAuthContext();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [savings, setSavings] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [state, setState] = useState(0);
  const [newSavings, setNewSavings] = useState({
    amount: "",
    date: moment().format("YYYY-MM-DD"),
    description: "",
  });

  const handleInputChange = (value, name) => {
    setNewSavings({ ...newSavings, [name]: value });
  };

  const addNewSaving = async () => {
    if (
      newSavings.date !== "" &&
      newSavings.amount !== "" &&
      newSavings.description !== ""
    ) {
      setButtonLoading(true);
      await AddSavingsToGoal(item?.id, newSavings, currentUser?.token)
        .then(async (res) => {
          console.log(res);
          Toast.show({
            type: "success",
            text1: "New Goal Created",
            text2: "New Goal created successfully 👋",
          });
          setButtonLoading(false);
          getSavingsOfGoals();
          setState(0);
        })
        .catch((err) => {
          alert({ message: err.response.data.message });
          Toast.show({
            type: "error",
            text1: "Something went wrong",
            text2: err.response.data.message,
          });
          setButtonLoading(false);
        });
    }
  };

  const getSavingsOfGoals = async () => {
    setLoading(true);
    await GetGoalSavings(item?.id, currentUser?.token)
      .then((res) => {
        setLoading(false);
        console.log(res?.data);
        setSavings(res?.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getSavingsOfGoals();
  }, []);

  return (
    <Card>
      <Title color={item?.color}>Goal Details</Title>
      <Wrapper>
        <DetailsWrapper color={item?.color}>
          <View style={{ gap: 12, flexDirection: "row" }}>
            <View style={{ flex: 1, gap: 3 }}>
              <GoalTitle>{item?.name}</GoalTitle>
              <Desc>{item?.description}</Desc>
            </View>
            <View style={{ gap: 4, flexDirection: "row" }}>
              <IconButton>
                <MaterialIcons
                  name="delete-outline"
                  size={14}
                  color={theme.text_primary}
                />
              </IconButton>
              <IconButton>
                <FontAwesome name="edit" size={14} color={theme.text_primary} />
              </IconButton>
            </View>
          </View>

          <View style={{ gap: 4 }}>
            <IconText>
              <MaterialCommunityIcons
                name="calendar-week-begin"
                size={18}
                color={theme.text_secondary}
              />
              <Date>
                Target Date:{" "}
                <Span color={theme.text_primary}>
                  {moment(item?.target_date).format("MMMM Do YYYY")}
                </Span>
              </Date>
            </IconText>
            <IconText>
              <MaterialCommunityIcons
                name="bullseye-arrow"
                size={18}
                color={theme.text_secondary}
              />
              <Date>
                Target Amount:{" "}
                <Span color={theme.primary}>
                  ₹{Math.trunc(item?.target_amount)}
                </Span>
              </Date>
            </IconText>
          </View>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 25,
                backgroundColor: theme.bg,
                marginLeft: -22,
              }}
            ></View>
            <View
              style={{
                flex: 1,
                borderStyle: "dashed",
                borderWidth: 1,
                borderRadius: 3,
                borderColor: theme.text_secondary + 50,
                height: 1,
              }}
            ></View>
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 25,
                backgroundColor: theme.bg,
                marginRight: -22,
              }}
            ></View>
          </View>

          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontWeight: "500",
                fontSize: 14,
                color: theme.text_secondary,
              }}
            >
              Currently Saved:
            </Text>
            <Amount>₹{Math.trunc(item?.achieved_amount)}</Amount>
          </View>

          <View style={{ gap: 5 }}>
            <View style={{ flex: 1 }}>
              <ProgressBar
                progress={item?.achieved_amount / item?.target_amount}
                color={theme.primary}
                style={{ borderRadius: 12, height: 6 }}
              />
            </View>
            <Bottom>
              <Marker>₹0</Marker>
              <CompletePercent>
                {((item?.achieved_amount * 100) / item?.target_amount).toFixed(
                  1
                )}
                %
              </CompletePercent>
              <Marker style={{ textAlign: "right" }}>
                ₹{Math.trunc(item?.target_amount)}
              </Marker>
            </Bottom>
          </View>
        </DetailsWrapper>
        {state === 0 ? (
          <Transactions>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <GoalTitle>Savings Transactions</GoalTitle>
              <View>
                <Button
                  micro
                  filled
                  color={theme.white}
                  bgcolor={theme.primary}
                  startIcon={
                    <MaterialIcons name="add" size={12} color={theme.white} />
                  }
                  onPress={() => setState(1)}
                >
                  Add Savings
                </Button>
              </View>
            </View>
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              <TransactionCardWrapper>
                {savings.map((item) => (
                  <TransactionsCard
                    item={item}
                    key={`savings-${item.id}`}
                    savings="savings_investments"
                  />
                ))}
              </TransactionCardWrapper>
            )}
          </Transactions>
        ) : (
          <Transactions>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <GoalTitle>Add New Savings</GoalTitle>
            </View>
            <InputText
              startIcon={
                <FontAwesome
                  name="rupee"
                  size={20}
                  color={theme.text_secondary}
                  style={{
                    marginRight: 5,
                    marginLeft: 5,
                  }}
                />
              }
              small
              value={newSavings.amount}
              onChangeText={handleInputChange}
              placeholder="Enter Savings Amount"
              label="Savings Amount"
              name="amount"
              type={"numeric"}
            />
            <InputText
              startIcon={
                <MaterialCommunityIcons
                  name="notebook-edit"
                  size={20}
                  color={theme.text_secondary}
                />
              }
              small
              value={newSavings.description}
              onChangeText={handleInputChange}
              placeholder="Enter Savings Short Description"
              label="Savings Description"
              name="description"
              type={"default"}
            />
            <DateInput
              startIcon={
                <Icon
                  name="calendar-month-outline"
                  size={20}
                  color={theme.text_secondary}
                />
              }
              small
              value={newSavings.date}
              onChange={(date, name) =>
                setNewSavings({
                  ...newSavings,
                  date: date,
                })
              }
              label="Savings Date"
              placeholder="Enter your savings date"
              name="date"
            />
            <Button
              small
              type="filled"
              color={theme.white}
              bgcolor={theme.primary}
              loading={buttonLoading}
              onPress={() => addNewSaving()}
              disabled={
                newSavings.date === "" ||
                newSavings.description === "" ||
                newSavings.amount === ""
              }
            >
              Add Amount
            </Button>
          </Transactions>
        )}
      </Wrapper>
    </Card>
  );
};

export default GoalsDetails;
