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
import { PieChart } from "react-native-gifted-charts";

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

const Right = styled.View`
  flex: 1;
  gap: 12px;
  align-items: center;
  justify-content: center;
`;
const Left = styled.View`
  justify-content: center;
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
const Item = styled.View`
  flex-direction: row;
  font-size: 12px;
  align-items: center;
`;

const renderDot = (color) => {
  return (
    <View
      style={{
        height: 6,
        width: 6,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 5,
      }}
    />
  );
};

const CategoryWiseGoal = ({ data }) => {
  const theme = useTheme();
  return (
    <CardContainer elevation={0.5}>
      <Wrapper>
        <View
          style={{
            gap: 1,
          }}
        >
          <Title>Goal Completed</Title>
          <Desc>Analysis of your goals progress</Desc>
        </View>
        <View
          style={{
            gap: 1,
            flexDirection: "row",
          }}
        >
          <Left>
            <PieChart data={data} radius={90} focusOnPress />
          </Left>

          <Right>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            >
              {data?.map((item, index) => (
                <Item key={`goal-chart-card-home-${item?.text}-${index}`}>
                  {renderDot(item?.color)}
                  <Text
                    style={{
                      color: theme.text_secondary,
                      fontSize: 14,
                    }}
                  >
                    {item?.text}
                  </Text>
                </Item>
              ))}
            </View>
          </Right>
        </View>
      </Wrapper>
    </CardContainer>
  );
};

export default CategoryWiseGoal;
