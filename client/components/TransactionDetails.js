import React, { useContext } from "react";
import { Alert, Text, View } from "react-native";
import styled, { css, useTheme } from "styled-components/native";
import Button from "../components/buttons/button";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import moment from "moment";
import { DeleteExpence } from "../api";
import Toast from "react-native-toast-message";
import { useAuthContext } from "../context/auth";
import { useBottomSheetContext } from "../context/bottomSheetContext";

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

const TransactionDetails = ({ item, savings }) => {
  const { setOpenBottomSheet } = useBottomSheetContext();
  const { currentUser } = useAuthContext();
  const router = useRouter();
  const theme = useTheme();

  const createAlert = () =>
    Alert.alert("Delete Transaction", "Your Transaction will be deleted", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Delete", onPress: () => handelDelete() },
    ]);

  const handelDelete = async () => {
    await DeleteExpence(item?.id, currentUser?.token)
      .then(async (res) => {
        Toast.show({
          type: "success",
          text1: "Transaction Deleted",
          text2: "Transaction Deleted successfully 👋",
        });
        setOpenBottomSheet({ open: false, content: null });
      })
      .catch((err) => {
        console.log(err);
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: err.response.data.message,
        });
      });
  };
  return (
    <Card>
      <Title color={item?.color}>Transaction Details</Title>
      <Toast />
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
          <Amount>₹{item?.amount}</Amount>
          <View
            style={{
              gap: 14,
            }}
          >
            <Date>
              {savings
                ? moment(item?.date).format("MMMM Do YYYY")
                : moment(item?.transactionDate).calendar()}
            </Date>
            <Desc> Note: {item?.description}</Desc>
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
          onPress={() => createAlert()}
        >
          Delete
        </Button>
        <Button
          small
          filled
          color={theme.white}
          bgcolor={theme.primary}
          startIcon={<FontAwesome name="edit" size={16} color={theme.white} />}
          onPress={() =>
            router.replace({
              pathname: `/add-transactions`,
              params: {
                edit: true,
                updateTransactionData: JSON.stringify({
                  id: item?.id,
                  amount: Math.trunc(item?.amount).toString(),
                  category: item?.category,
                  description: item?.description,
                  transactionDate: item?.transactionDate,
                  paymentMethod: item?.paymentMethod,
                }),
              },
            })
          }
        >
          Edit
        </Button>
      </ButtonWrapper>
    </Card>
  );
};

export default TransactionDetails;
