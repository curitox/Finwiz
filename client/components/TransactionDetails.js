import React, { useContext } from "react";
import { Text, View } from "react-native";
import styled, { css, useTheme } from "styled-components/native";
import Button from "../components/buttons/button";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Card = styled.View`
  flex: 1;
  flex-direction: column;
  padding: 2px 16px 16px 16px;
  gap: 12px;
`;

const Title = styled.Text`
  text-align: center;
  font-size: 20px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  flex-direction: column;
  padding: 8px 16px 16px 16px;
`;
const Bottom = styled.View`
  flex: 1;
  flex-direction: column;
  padding: 12px 4px;
  gap: 6px;
`;
const Top = styled.View`
  margin-top: -24px;
  width: 58px;
  height: 58px;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color + 20};
  border-radius: 28px;
`;
const Desc = styled.Text`
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.text_primary};
  padding: 6px 10px;
  border-radius: 8px;
  background: ${({ theme }) => theme.text_secondary + 10};
`;
const Date = styled.Text`
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
`;
const Amount = styled.Text`
  font-size: 28px;
  text-align: center;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`;

const ButtonWrapper = styled.View`
  gap: 12px;
  flex-direction: row;
`;

const TransactionDetails = ({ item }) => {
  const theme = useTheme();
  return (
    <Card>
      <Title color={item?.color}>Transaction Details</Title>
      <Wrapper
        color={item?.color}
        style={{
          borderStyle: "dashed",
          borderWidth: 1.5,
          borderRadius: 12,
          borderColor: theme.text_secondary + 50,
        }}
      >
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "flex-end",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <MaterialCommunityIcons
            name="check-decagram"
            size={28}
            color={theme.categoryGreen}
          />
        </View>
        <Top color={item?.color}>{item?.icon}</Top>
        <Bottom>
          <Amount>$ 120</Amount>
          <View
            style={{
              gap: 14,
            }}
          >
            <Date>12th may 2024</Date>
            <Desc> Note: Prashant Sahoo</Desc>
          </View>
        </Bottom>
      </Wrapper>
      <ButtonWrapper>
        <Button
          small
          type="outlined"
          color={theme.categoryRed + 90}
          bordercolor={theme.categoryRed + 90}
          startIcon={
            <MaterialIcons
              name="delete-outline"
              size={16}
              color={theme.categoryRed + 90}
            />
          }
        >
          Delete
        </Button>
        <Button
          small
          filled
          color={theme.white}
          bgcolor={theme.primary}
          startIcon={<FontAwesome name="edit" size={16} color={theme.white} />}
        >
          Edit
        </Button>
      </ButtonWrapper>
    </Card>
  );
};

export default TransactionDetails;
