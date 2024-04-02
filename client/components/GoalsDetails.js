import React, { useContext } from "react";
import { Text, View } from "react-native";
import styled, { css, useTheme } from "styled-components/native";
import Button from "../components/buttons/button";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import TransactionsCard from "./cards/Transactions";

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
  font-size: 28px;
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
  const theme = useTheme();
  return (
    <Card>
      <Title color={item?.color}>Goal Details</Title>
      <Wrapper>
        <DetailsWrapper color={item?.color}>
          {/* <View
            style={{
              alignItems: "flex-start",
              justifyContent: "flex-end",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <MaterialCommunityIcons
              name="check-decagram"
              size={28}
              color={theme.categoryGreen}
            />
          </View> */}
          <View style={{ gap: 12, flexDirection: "row" }}>
            <View style={{ flex: 1, gap: 3 }}>
              <GoalTitle>Iphone 15</GoalTitle>
              <Desc>Buy a new iphone in big billion sale</Desc>
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
                Target Date: <Span color={theme.text_primary}>1 Oct 2025</Span>
              </Date>
            </IconText>
            <IconText>
              <MaterialCommunityIcons
                name="bullseye-arrow"
                size={18}
                color={theme.text_secondary}
              />
              <Date>
                Target Amount: <Span color={theme.primary}>$50000</Span>
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
          <Text
            style={{
              fontWeight: "500",
              fontSize: 14,
              color: theme.text_secondary,
            }}
          >
            Currently Saved
          </Text>

          <View style={{ gap: 5 }}>
            <Amount>$30000</Amount>
            <View style={{ flex: 1 }}>
              <ProgressBar
                progress={0.5}
                color={theme.primary}
                style={{ borderRadius: 12, height: 6 }}
              />
            </View>
            <Bottom>
              <Marker>$0</Marker>
              <CompletePercent>60%</CompletePercent>
              <Marker style={{ textAlign: "right" }}>$50000</Marker>
            </Bottom>
          </View>
        </DetailsWrapper>
        <Transactions>
          <GoalTitle>Savings Transactions</GoalTitle>
          <TransactionCardWrapper>
            {TransactionsContent.map((item) => (
              <TransactionsCard item={item} key={item.value} />
            ))}
          </TransactionCardWrapper>
        </Transactions>
      </Wrapper>
    </Card>
  );
};

export default GoalsDetails;
