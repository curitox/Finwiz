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

const CardContainer = styled(Card)`
  flex: 1;
  ${({ full }) =>
    !full &&
    `
  width: 280px;`}
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

const GoalCard = ({ full, item }) => {
  const { setOpenBottomSheet } = useBottomSheetContext();
  const theme = useTheme();
  return (
    <CardContainer
      full={full}
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
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                <Title>{item?.name}</Title>
                {item?.status === "COMPLETE" && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={16}
                    color={theme.green}
                  />
                )}
              </View>
              <Desc>{item?.description}</Desc>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-week-begin"
                  size={13}
                  color={theme.text_secondary}
                />
                <Date>{moment(item?.target_date).format("MMMM Do YYYY")}</Date>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <MaterialCommunityIcons
                  name="bullseye-arrow"
                  size={14}
                  color={theme.text_secondary}
                />
                <Date>₹{Math.trunc(item?.target_amount)}</Date>
              </View>
            </View>
          </Left>
        </View>
        <Bottom>
          <CompletePercent>
            {((item?.achieved_amount * 100) / item?.target_amount).toFixed(1)}%
          </CompletePercent>
          <View style={{ flex: 1 }}>
            <ProgressBar
              progress={item?.achieved_amount / item?.target_amount}
              color={item?.status === "COMPLETE" ? theme.green : theme.primary}
              style={{ borderRadius: 12, height: 6 }}
            />
          </View>
          <CompletedAmount
            style={{
              color: item?.status === "COMPLETE" ? theme.green : theme.primary,
            }}
          >
            ₹{Math.trunc(item?.achieved_amount)}
          </CompletedAmount>
        </Bottom>
      </Wrapper>
    </CardContainer>
  );
};

export default GoalCard;
