import { View, Text, Pressable } from "react-native";
import { Link, router, useRouter } from "expo-router";
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

const Container = styled.View`
  flex: 1;
  gap: 22px;
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
  text-align: center;
  font-weight: 600;
  font-size: 24px;
  color: ${({ theme }) => theme.text_primary};
`;

const Wrapper = styled.View`
  flex: 1;
  justify-content: space-between;
  padding: 18px 0px 8px 0px;
  gap: 22px;
`;

const InputField = styled.TextInput`
  font-size: 38px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  padding-bottom: 6px;
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

export default function AddTransactions() {
  const router = useRouter();
  const theme = useTheme();
  const { signOut, currentUser } = useAuthContext();

  const TransactionCategories = [
    {
      name: "Food",
      color: "#FF6F61",
      value: "food",
      icon: (
        <MaterialCommunityIcons name="food-turkey" size={24} color="#FF6F61" />
      ),
    },
    {
      name: "Shopping",
      color: "#FFD166",
      value: "shopping",
      icon: (
        <MaterialCommunityIcons name="shopping" size={24} color="#FFD166" />
      ),
    },
    {
      name: "Transportation",
      color: "#4CAF50",
      value: "transportation",
      icon: (
        <MaterialCommunityIcons name="train-car" size={24} color="#4CAF50" />
      ),
    },
    {
      name: "Housing",
      color: "#5DADE2",
      value: "housing",
      icon: (
        <MaterialCommunityIcons
          name="home-analytics"
          size={24}
          color="#5DADE2"
        />
      ),
    },
    {
      name: "Utilities",
      color: "#FFA07A",
      value: "utilities",
      icon: <MaterialCommunityIcons name="tools" size={24} color="#FFA07A" />,
    },
    {
      name: "Health & Fitness",
      color: "#AF7AC5",
      value: "health_fitness",
      icon: (
        <MaterialCommunityIcons name="heart-pulse" size={24} color="#AF7AC5" />
      ),
    },
    {
      name: "Personal Care",
      color: "#AED6F1",
      value: "personal_care",
      icon: (
        <MaterialCommunityIcons
          name="face-woman-shimmer"
          size={24}
          color="#AED6F1"
        />
      ),
    },
    {
      name: "Entertainment",
      color: "#F5B041",
      value: "entertainment",
      icon: (
        <MaterialCommunityIcons
          name="gamepad-variant"
          size={24}
          color="#F5B041"
        />
      ),
    },
    {
      name: "Education",
      color: "#76D7C4",
      value: "education",
      icon: <MaterialCommunityIcons name="school" size={24} color="#76D7C4" />,
    },
    {
      name: "Travel",
      color: "#FAD7A0",
      value: "travel",
      icon: (
        <MaterialCommunityIcons name="airplane" size={24} color="#FAD7A0" />
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
      name: "Debt Payments",
      color: "#85C1E9",
      value: "debt_payments",
      icon: (
        <MaterialCommunityIcons
          name="credit-card-clock"
          size={24}
          color="#85C1E9"
        />
      ),
    },
    {
      name: "Gifts & Donations",
      color: "#D7BDE2",
      value: "gifts_donations",
      icon: <MaterialCommunityIcons name="gift" size={24} color="#D7BDE2" />,
    },
    {
      name: "Miscellaneous",
      color: "#E59866",
      value: "miscellaneous",
      icon: (
        <MaterialCommunityIcons name="atom-variant" size={24} color="#E59866" />
      ),
    },
  ];

  const [stages, setStages] = useState(0);
  const [transactionData, setTransactionData] = useState({
    amount: "",
    transactionDate: "",
    category: "",
    description: "",
  });

  const handleInputChange = (value, name) => {
    setTransactionData({ ...transactionData, [name]: value });
  };

  const handelNext = () => {
    if (
      stages === 0 &&
      transactionData.amount !== "" &&
      transactionData.amount !== "0"
    ) {
      setStages(1);
    }
  };

  return (
    <>
      {stages === 0 ? (
        <Container>
          <Back onPress={() => router.replace("/home")}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={theme.text_primary}
            />
          </Back>
          <Title>Add New Transaction</Title>
          <Wrapper>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <FontAwesome
                name="rupee"
                size={28}
                color={theme.text_secondary}
              />
              <InputField
                value={transactionData.amount}
                placeholder="0"
                name="amount"
                onChangeText={(text) => handleInputChange(text, "amount")}
                placeholderTextColor={"#777"}
                keyboardType="numeric"
                autoFocus
              />
            </View>
            <Button
              type="filled"
              color={theme.white}
              bgcolor={theme.primary}
              // loading={loading}
              onPress={() => handelNext()}
              disabled={
                transactionData.amount === "" || transactionData.amount === "0"
              }
            >
              Continue
            </Button>
          </Wrapper>
        </Container>
      ) : (
        <Container>
          <Back onPress={() => setStages(0)}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={theme.text_primary}
            />
          </Back>
          <Title>Transaction Details</Title>
          <Wrapper>
            <View
              style={{
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
                value={transactionData.transactionDate}
                onChange={(date, name) =>
                  setTransactionData({
                    ...transactionData,
                    transactionDate: date,
                  })
                }
                label="Transaction Date"
                placeholder="Enter your transaction date"
                name="transactionDate"
              />
              <InputText
                startIcon={
                  <MaterialCommunityIcons
                    name="notebook-edit"
                    size={24}
                    color={theme.text_secondary}
                  />
                }
                value={transactionData.description}
                onChangeText={handleInputChange}
                placeholder="Enter a note"
                label="Transaction Decription"
                name="description"
                type={"default"}
              />
              <SelectagleItem>
                <InputName>Gender</InputName>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  {TransactionCategories.map((transactionCategories, index) => (
                    <SelectableChip
                      key={`transactionCategories-${index}`}
                      selected={
                        transactionCategories.value === transactionData.category
                      }
                      onPress={() =>
                        setTransactionData({
                          ...transactionData,
                          category: transactionCategories.value,
                        })
                      }
                      startIcon={transactionCategories.icon}
                      color={transactionCategories.color}
                    >
                      {transactionCategories.name}
                    </SelectableChip>
                  ))}
                </View>
              </SelectagleItem>
            </View>

            <Button
              type="filled"
              color={theme.white}
              bgcolor={theme.primary}
              // loading={loading}
              onPress={() => handelNext()}
              disabled={
                transactionData.transactionDate === "" ||
                transactionData.category === "" ||
                transactionData.description === ""
              }
            >
              Continue
            </Button>
          </Wrapper>
        </Container>
      )}
    </>
  );
}
