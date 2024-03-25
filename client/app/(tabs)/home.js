import React, { useEffect, useState } from "react";
import { View, Text, StatusBar, TouchableHighlightBase } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useThemeContext } from "../../context/themeContext";
import { router, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuthContext } from "../../context/auth";
import Button from "../../components/buttons/button";

const Wrapper = styled.ScrollView`
  flex: 1;
  padding: 80px 0px;
  background-color: ${({ theme }) => theme.bg};
`;

const Home = () => {
  const router = useRouter();
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
        <TouchableOpacity onPress={() => router.replace("/other")}>
          <Text>Other page</Text>
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
};

export default Home;
