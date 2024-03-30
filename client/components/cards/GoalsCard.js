import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text,
  ImageBackground,
} from "react-native";
import styled, { css, useTheme } from "styled-components/native";
import BgImage from "../../assets/icons/pattern.png";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

const Card = styled.TouchableOpacity`
  flex: 1;
  max-width: 200px;
  height: 120px;
  flex-direction: column;
  border-radius: 12px;
  background: #26a9f5;
  gap: 6px;
`;

const ImageBg = styled.ImageBackground`
  flex: 0.8;
  border-radius: 12px;
`;
const Wrapper = styled.View`
  flex: 1;
  flex-direction: row;
  border-radius: 20px;
  padding: 12px 16px;
`;
const Right = styled.View`
  flex: 0.9;
  gap: 14px;
`;
const Left = styled.View`
  flex: 0.8;
  justify-content: center;
`;
const Title = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.white};
`;
const Value = styled.Text`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.white};
`;
const GoalCard = () => {
  const theme = useTheme();
  const data = [
    {
      name: "Seoul",
      population: 21500000,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Toronto",
      population: 2800000,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Beijing",
      population: 527612,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "New York",
      population: 8538000,
      color: "#ffffff",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Moscow",
      population: 11920000,
      color: "rgb(0, 0, 255)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];
  const series = [123, 321, 123, 789, 537, 120, 400];
  const sliceColors = [
    "#fbd203", // Yellow
    "#ffb300", // Orange
    "#ff9100", // Darker Orange
    "#ff6c00", // Even Darker Orange
    "#ff3c00", // Reddish Orange
    "#ff0000", // Red
    "#00ff00", // Green
  ];

  return (
    <Card>
      {/* <ImageBg source={BgImage} resizeMode="cover">
      </ImageBg> */}

      <Wrapper>
        <Left></Left>
      </Wrapper>
    </Card>
  );
};

export default GoalCard;
