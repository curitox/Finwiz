import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableHighlightBase,
  Linking,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styled, { useTheme } from "styled-components/native";
import { useThemeContext } from "../../context/themeContext";
import { router, useRouter } from "expo-router";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { useAuthContext } from "../../context/auth";
import Button from "../../components/buttons/button";
import NavigationCards from "../../components/cards/NavigationCards";
import { Categories } from "../../utils/data";
import ChartCard from "../../components/cards/ChartCard";
import Topbar from "../../components/Topbar";
import { Entypo } from "@expo/vector-icons";
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import GoalCard from "../../components/cards/GoalsCard";
import TextButton from "../../components/buttons/textButton";
import TransactionsCard from "../../components/cards/Transactions";

const Container = styled.ScrollView`
  flex: 1;
  padding: 32px 0px;
  background-color: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.View`
  flex: 1;
  gap: -6px;
`;

const Section = styled.View`
  flex: 1;
  gap: 14px;
  padding: 12px;
`;
const TitleWrapper = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;
const Title = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;
const CardWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const GoalsWrapper = styled.ScrollView`
  gap: 16px;
  flex: 1;
`;

const TransactionCardWrapper = styled.View`
  flex-direction: column;
`;

const Home = () => {
  const router = useRouter();
  const theme = useTheme();
  const themeMode = useThemeContext();
  const { toggleTheme } = useThemeContext();

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

  const categories = [
    {
      id: 1,
      text: "Add Transaction",
      link: "/add-transactions",
      icon: (
        <MaterialIcons
          name="library-add"
          size={24}
          color={theme.categoryGreen}
        />
      ),
      background: theme.categoryGreenLight,
      color: theme.categoryGreen,
    },
    {
      id: 2,
      text: "Create Goals",
      link: "/add-goals",
      icon: (
        <MaterialCommunityIcons
          name="medal"
          size={24}
          color={theme.categoryYellow}
        />
      ),
      background: theme.categoryYellowLight,
      color: theme.categoryYellow,
    },
    {
      id: 3,
      text: "AI Insights",
      link: "/ai-insights",
      icon: (
        <MaterialCommunityIcons
          name="robot"
          size={24}
          color={theme.categoryViolet}
        />
      ),
      background: theme.categoryVioletLight,
      color: theme.categoryViolet,
    },
    {
      id: 4,
      text: "Investment",
      link: "/investment",
      icon: (
        <MaterialCommunityIcons
          name="hand-coin"
          size={22}
          color={theme.categoryBlue}
        />
      ),
      background: theme.categoryBlueLight,
      color: theme.categoryBlue,
    },
  ];

  const OpenUpiApp = async () => {
    const upiUrl =
      "upi://pay?pa=8336940178@paytm&pn=Debashree%20Chanda&mc=1&mode=02&purpose=00";
    await Linking.openURL(upiUrl).then((res) => console.log(res));
    console.log("Here");
  };

  return (
    <Container>
      <Wrapper>
        <StatusBar
          barStyle={
            themeMode.theme === "light" ? "dark-content" : "light-content"
          }
          backgroundColor={theme.bg} // Set the status bar color based on the theme
        />
        <Topbar />
        <Section>
          <ChartCard />
        </Section>
        <Section>
          <Title>Quick Links</Title>
          <CardWrapper
          // data={categories}
          // renderItem={({ item }) => (
          //   <NavigationCards data={item} onPress={() => toggleTheme()} />
          // )}
          // horizontal
          // showsVerticalScrollIndicator={false}
          // keyExtractor={(item) => item.id}
          // contentContainerStyle={{ columnGap: 8 }}
          >
            {categories.map((item) => (
              <NavigationCards
                data={item}
                onPress={() => toggleTheme()}
                key={item.id}
              />
            ))}
          </CardWrapper>
        </Section>
        <Section>
          <TitleWrapper>
            <Title>Goals</Title>

            <TextButton
              small
              label="View All"
              color={theme.primary}
              disabled={false}
              enabled={true}
              onPress={() => router.replace("/goals")}
            />
          </TitleWrapper>
          <GoalsWrapper
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {categories.map((item) => (
              <GoalCard key={item.id} />
            ))}
          </GoalsWrapper>
        </Section>
        <Section>
          <Title>Transactions</Title>
          <TransactionCardWrapper>
            {TransactionCategories.map((item) => (
              <TransactionsCard item={item} key={item.value} />
            ))}
          </TransactionCardWrapper>
        </Section>
        <View
          style={{
            height: 90,
          }}
        ></View>
      </Wrapper>
    </Container>
  );
};

export default Home;
