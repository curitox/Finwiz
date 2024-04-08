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
import { BarChart } from "react-native-gifted-charts";

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
  gap: 16px;
  border-radius: 20px;
  padding: 18px 16px;
`;

const Title = styled.Text`
  font-weight: 500;
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.text_primary + 90};
`;

const WeeklyExpence = ({ data }) => {
  const theme = useTheme();
  const newData = data?.map((obj) => ({
    ...obj,
    labelTextStyle: { color: theme.text_secondary },
  }));
  return (
    <CardContainer elevation={0.5}>
      <Wrapper>
        <View
          style={{
            gap: 1,
          }}
        >
          <Title>Weekly Expences</Title>
          <Desc>Analysis of your last 7 days expence</Desc>
        </View>
        <BarChart
          barWidth={24}
          noOfSections={5}
          barBorderRadius={4}
          spacing={20}
          frontColor={theme.green}
          data={newData}
          yAxisThickness={0}
          xAxisThickness={0.1}
          isAnimated
          yAxisTextStyle={{ color: theme.text_secondary }}
          xAxisTextStyle={{ color: theme.text_secondary }}
        />
      </Wrapper>
    </CardContainer>
  );
};

export default WeeklyExpence;
