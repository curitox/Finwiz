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
import { ProgressBar, Colors } from "react-native-paper";
import { Card } from "react-native-paper";
import { useBottomSheetContext } from "../../context/bottomSheetContext";
import GoalsDetails from "../GoalsDetails";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import { LineChart } from "react-native-gifted-charts";

const CardContainer = styled(Card)`
  flex: 1;
  margin: 2px 12px 8px 4px;
  flex-direction: column;
  border-radius: 12px;
  gap: 6px;
  background-color: ${({ theme }) => theme.card};
`;

const Wrapper = styled(Card.Content)`
  flex: 1;
  gap: 12px;
  border-radius: 20px;
  padding: 18px 16px;
`;

const Title = styled.Text`
  font-weight: 500;
  font-size: 15px;
  color: ${({ theme }) => theme.text_secondary};
`;
const Desc = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;
const GoalCompletionChart = ({ data }) => {
  const theme = useTheme();
  return (
    <CardContainer elevation={0.5}>
      <Wrapper>
        <Title>Goal Progress</Title>
        <LineChart
          isAnimated
          thickness={3}
          color="#07BAD1"
          noOfSections={5}
          animateOnDataChange
          animationDuration={1000}
          onDataChangeAnimationDuration={300}
          areaChart
          hideDataPoints
          curved
          yAxisTextStyle={{ color: theme.text_secondary }}
          data={data[1]}
          // data2={data[1]}
          startFillColor="rgb(46, 217, 255)"
          startOpacity={0.8}
          endFillColor="rgb(203, 241, 250)"
          endOpacity={0.3}
          spacing={22}
          initialSpacing={10}
          yAxisColor="lightgray"
          xAxisColor="lightgray"
        />
      </Wrapper>
    </CardContainer>
  );
};

export default GoalCompletionChart;
