import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text,
  ImageBackground,
} from "react-native";
import styled, { css, useTheme } from "styled-components/native";
import { Card } from "react-native-paper";

const CardContainer = styled(Card)`
  flex: 1;
  margin: 2px 12px 8px 4px;
  flex-direction: column;
  border-radius: 12px;
  gap: 6px;
  background-color: ${({ theme }) => theme.bg};
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

const BudgetRecomendations = ({ data }) => {
  const theme = useTheme();
  return (
    <CardContainer elevation={0.5}>
      <Wrapper>
        <View
          style={{
            gap: 1,
          }}
        >
          <Title>Budget Recomendations</Title>
          <Desc>Our recomendations to optimize your budgets</Desc>
        </View>
        <View
          style={{
            gap: 1,
            flexDirection: "row",
          }}
        ></View>
      </Wrapper>
    </CardContainer>
  );
};

export default BudgetRecomendations;
