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
  flex-direction: column;
`;

const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  flex-direction: row;
  padding: 0px 0px;
  gap: 16px;
`;
const Right = styled.View`
  flex: 1;
  flex-direction: row;
  border-bottom-color: ${({ theme }) => theme.text_secondary + 50};
  border-bottom-width: 0.5px;
  padding: 12px 4px;
`;
const Left = styled.View`
  width: 46px;
  height: 46px;
  background-color: ${({ theme }) => theme.categoryRedLight};
  border-radius: 25px;
`;
const Name = styled.Text`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
`;
const Date = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;
const Amount = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
`;

const Tag = styled.View`
  width: fit-content;
  padding: 2px 6px;
  border-radius: 8px;
  background-color: ${({ expence, theme }) =>
    expence ? theme.red + 20 : theme.green + 20};
`;
const TagText = styled.Text`
  font-size: 12px;
  color: ${({ expence, theme }) => (expence ? theme.red : theme.green)};
`;
const TransactionsCard = () => {
  const theme = useTheme();
  const data = {
    name: "Seoul",
    population: 21500000,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  };

  return (
    <Card>
      <Wrapper>
        <Left>{/* <Image /> */}</Left>
        <Right>
          <View
            style={{
              flex: 1,
              gap: 6,
              justifyContent: "space-between",
            }}
          >
            <Name>Prashant Sahoo</Name>
            <Date>12th may 2024</Date>
          </View>
          <View
            style={{
              gap: 6,
              justifyContent: "space-between",
            }}
          >
            <Amount>$120</Amount>
            {/* <Tag expence={true}>
              <TagText expence={true}>Expence</TagText>
            </Tag> */}
          </View>
        </Right>
      </Wrapper>
    </Card>
  );
};

export default TransactionsCard;
