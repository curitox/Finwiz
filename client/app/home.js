import React, { useEffect, useState } from "react";
import { View, Text, StatusBar } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useThemeContext } from "../context/themeContext";
import { router } from "expo-router";

const Wrapper = styled.ScrollView`
  flex: 1;
  padding: 80px 0px;
  background-color: ${({ theme }) => theme.bg};
`;

const Home = () => {
  const theme = useTheme();
  const themeMode = useThemeContext();
  const { toggleTheme } = useThemeContext();

  return (
    <Wrapper>
      <StatusBar
        barStyle={
          themeMode.theme === "light" ? "dark-content" : "light-content"
        }
        backgroundColor={theme.bg} // Set the status bar color based on the theme
      />
      <View>
        <Text>Hi</Text>
      </View>
    </Wrapper>
  );
};

export default Home;
