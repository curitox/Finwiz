import React, { useContext } from "react";
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
import BottomSheetContext, {
  useBottomSheetContext,
} from "../../context/bottomSheetContext";
import TransactionDetails from "../TransactionDetails";
import { getCategoryByValue } from "../../utils/data";
import moment from "moment";

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
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color + 20};
  border-radius: 25px;
`;
const Desc = styled.Text`
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

const TagText = styled.Text`
  font-size: 10px;
  color: ${({ theme }) => theme.text_secondary};
`;
const TransactionsCard = ({ savings, item }) => {
  const { setOpenBottomSheet } = useBottomSheetContext();

  return (
    <Card
      onPress={() =>
        setOpenBottomSheet({
          open: true,
          content: (
            <TransactionDetails
              savings={savings}
              item={{
                ...item,
                color: savings
                  ? getCategoryByValue(savings)?.color
                  : getCategoryByValue(item?.category)?.color,
                icon: savings
                  ? getCategoryByValue(savings)?.icon
                  : getCategoryByValue(item?.category)?.icon,
              }}
            />
          ),
          snapPoint: ["45%"],
        })
      }
    >
      <Wrapper>
        <Left
          color={
            savings
              ? getCategoryByValue(savings)?.color
              : getCategoryByValue(item?.category)?.color
          }
        >
          {savings
            ? getCategoryByValue(savings)?.icon
            : getCategoryByValue(item?.category)?.icon}
        </Left>
        <Right>
          <View
            style={{
              flex: 1,
              gap: 6,
              justifyContent: "space-between",
            }}
          >
            <Desc>{item?.description}</Desc>
            {savings ? (
              <Date>{moment(item?.date).format("MMMM Do YYYY")}</Date>
            ) : (
              <Date>
                {moment(item?.transactionDate).calendar()} -
                <TagText> {item?.paymentMethod}</TagText>
              </Date>
            )}
          </View>
          <View
            style={{
              gap: 6,
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Amount>₹{item?.amount}</Amount>
          </View>
        </Right>
      </Wrapper>
    </Card>
  );
};

export default TransactionsCard;
