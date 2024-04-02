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

const CardContainer = styled(Card)`
  flex: 1;
  width: 280px;
  margin: 2px 12px 8px 4px;
  flex-direction: column;
  border-radius: 12px;
  gap: 6px;
  background-color: ${({ theme }) => theme.bg};
`;

const IconButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 32px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.text_secondary + 20};
`;

const Wrapper = styled(Card.Content)`
  flex: 1;
  gap: 12px;
  border-radius: 20px;
  padding: 12px 16px;
`;

const Left = styled.View`
  flex: 1;
  gap: 6px;
`;
const Right = styled.View`
  gap: 2px;
`;
const Bottom = styled.View`
  flex: 1;
  gap: 16px;
  align-items: center;
  flex-direction: row;
`;

const Title = styled.Text`
  font-weight: 500;
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;
const Date = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.text_primary};
`;
const CompletedAmount = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
`;
const CompletePercent = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
`;

const renderDot = (color) => {
  return (
    <View
      style={{
        height: 4,
        width: 4,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 5,
      }}
    />
  );
};

const GoalCard = ({ item }) => {
  const { setOpenBottomSheet } = useBottomSheetContext();
  const theme = useTheme();
  return (
    <CardContainer
      onPress={() =>
        setOpenBottomSheet({
          open: true,
          content: <GoalsDetails item={item} />,
          snapPoint: ["50%", "80%"],
        })
      }
    >
      <Wrapper>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
          }}
        >
          <Left>
            <View
              style={{
                gap: 2,
              }}
            >
              <Title>Iphone 15</Title>
              <Desc>Buy a new iphone in big billion sale</Desc>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {renderDot(theme.text_secondary)}
                <Date>1 Oct 2025 </Date>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {renderDot(theme.text_secondary)}
                <Date>$50000</Date>
              </View>
            </View>
          </Left>
          {/* <Right>
            <Amount>$50000</Amount>
          </Right> */}
        </View>
        <Bottom>
          <CompletePercent>60%</CompletePercent>
          <View style={{ flex: 1 }}>
            <ProgressBar
              progress={0.5}
              color={theme.primary}
              style={{ borderRadius: 12, height: 6 }}
            />
          </View>
          <CompletedAmount>$30000</CompletedAmount>
        </Bottom>
      </Wrapper>
    </CardContainer>
  );
};

export default GoalCard;
