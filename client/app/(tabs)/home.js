import React, { useEffect, useState } from "react";
import { View, Text, StatusBar, TouchableHighlightBase } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styled, { useTheme } from "styled-components/native";
import { useThemeContext } from "../../context/themeContext";
import { router, useRouter } from "expo-router";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { useAuthContext } from "../../context/auth";
import Button from "../../components/buttons/button";
import NavigationCards from "../../components/cards/NavigationCards";
import { Categories } from "../../utils/data";

const Wrapper = styled.ScrollView`
  flex: 1;
  padding: 80px 0px;
  background-color: ${({ theme }) => theme.bg};
`;

const Section = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;
const CardWrapper = styled(FlatList)``;

const Home = () => {
  const router = useRouter();
  const theme = useTheme();
  const themeMode = useThemeContext();
  const { toggleTheme } = useThemeContext();

  const categories = [
    {
      id: 1,
      text: "Transactions",
      icon: <FontAwesome size={18} name="home" color={theme.categoryGreen} />,
      background: theme.categoryGreenLight,
      color: theme.categoryGreen,
    },
    {
      id: 2,
      text: "Transactions",
      icon: <FontAwesome size={18} name="home" color={theme.categoryYellow} />,
      background: theme.categoryYellowLight,
      color: theme.categoryYellow,
    },
    {
      id: 3,
      text: "Transactions",
      icon: <FontAwesome size={18} name="home" color={theme.categoryViolet} />,
      background: theme.categoryVioletLight,
      color: theme.categoryViolet,
    },
    {
      id: 4,
      text: "Transactions",
      icon: <FontAwesome size={18} name="home" color={theme.categoryBlue} />,
      background: theme.categoryBlueLight,
      color: theme.categoryBlue,
    },
    {
      id: 5,
      text: "Transactions",
      icon: <FontAwesome size={18} name="home" color={theme.categoryRed} />,
      background: theme.categoryRedLight,
      color: theme.categoryRed,
    },
  ];

  console.log(theme.bg);

  return (
    <Wrapper>
      <StatusBar
        barStyle={
          themeMode.theme === "light" ? "dark-content" : "light-content"
        }
        backgroundColor={theme.bg} // Set the status bar color based on the theme
      />
      <Section>
        <CardWrapper
          data={categories}
          renderItem={({ item }) => (
            <NavigationCards data={item} onPress={() => toggleTheme()} />
          )}
          horizontal
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ columnGap: 16 }}
        />
      </Section>
      <TouchableOpacity onPress={() => router.replace("/other")}>
        <Text>Other page</Text>
      </TouchableOpacity>
    </Wrapper>
  );
};

export default Home;
