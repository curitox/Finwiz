import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableHighlightBase,
  Linking,
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

const TransactionCardWrapper = styled.View`
  flex-direction: column;
`;

const Home = () => {
  const router = useRouter();
  const theme = useTheme();
  const themeMode = useThemeContext();
  const { toggleTheme } = useThemeContext();

  const categories = [
    {
      id: 1,
      text: "Add Transaction",
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
      text: "AI Suggestions",
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

          <GoalCard />
        </Section>
        <Section>
          <Title>Transactions</Title>
          <TransactionCardWrapper>
            <TransactionsCard />
            <TransactionsCard />
            <TransactionsCard />
            <TransactionsCard />
            <TransactionsCard />
            <TransactionsCard />
            <TransactionsCard />
            <TransactionsCard />
            <TransactionsCard />
            <TransactionsCard />
            <TransactionsCard />
            <TransactionsCard />
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
