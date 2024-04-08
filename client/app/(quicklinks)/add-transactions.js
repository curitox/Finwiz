import { View, Text, Pressable, Linking } from "react-native";
import { Link, router, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useAuthContext } from "../../context/auth";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import InputText from "../../components/text_fields/inputText";
import Button from "../../components/buttons/button";
import DateInput from "../../components/text_fields/dateInput";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SelectableChip from "../../components/selectable/SelectableChip";
import { AddExpence, UpdateExpence } from "../../api";
import Toast from "react-native-toast-message";
import moment from "moment";

const Container = styled.View`
  flex: 1;
  gap: 22px;
  padding: 42px 16px 16px 16px;
  background-color: ${({ theme }) => theme.bg};
`;
const Back = styled.TouchableOpacity`
  width: 46px;
  height: 46px;
  border-radius: 46px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.text_secondary + 20};
`;
const Title = styled.Text`
  text-align: center;
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.text_primary};
`;

const UPIID = styled.Text`
  width: fit-content;
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.text_primary};
  padding: 6px 10px;
  border-radius: 8px;
  background: ${({ theme }) => theme.text_secondary + 10};
`;

const Wrapper = styled.View`
  flex: 1;
  justify-content: space-between;
  padding: 18px 0px 8px 0px;
  gap: 22px;
`;

const InputField = styled.TextInput`
  font-size: 38px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  padding-bottom: 6px;
`;

const SelectagleItem = styled.View`
  flex-direction: column;
  padding: 4px 4px;
  gap: 8px;
`;

const InputName = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;

const IconContainer = styled.View`
  padding: 0px 6px;
`;

export default function AddTransactions() {
  const { data, updateTransactionData, edit } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState();
  const { currentUser } = useAuthContext();

  const TransactionCategories = [
    {
      name: "Food",
      color: "#FF6F61",
      value: "food",
      icon: (
        <MaterialCommunityIcons name="food-turkey" size={24} color="#FF6F61" />
      ),
    },
    {
      name: "Shopping",
      color: "#FFD166",
      value: "shopping",
      icon: (
        <MaterialCommunityIcons name="shopping" size={24} color="#FFD166" />
      ),
    },
    {
      name: "Transportation",
      color: "#4CAF50",
      value: "transportation",
      icon: (
        <MaterialCommunityIcons name="train-car" size={24} color="#4CAF50" />
      ),
    },
    {
      name: "Housing",
      color: "#5DADE2",
      value: "housing",
      icon: (
        <MaterialCommunityIcons
          name="home-analytics"
          size={24}
          color="#5DADE2"
        />
      ),
    },
    {
      name: "Utilities",
      color: "#FFA07A",
      value: "utilities",
      icon: <MaterialCommunityIcons name="tools" size={24} color="#FFA07A" />,
    },
    {
      name: "Health & Fitness",
      color: "#AF7AC5",
      value: "health_fitness",
      icon: (
        <MaterialCommunityIcons name="heart-pulse" size={24} color="#AF7AC5" />
      ),
    },
    {
      name: "Personal Care",
      color: "#AED6F1",
      value: "personal_care",
      icon: (
        <MaterialCommunityIcons
          name="face-woman-shimmer"
          size={24}
          color="#AED6F1"
        />
      ),
    },
    {
      name: "Entertainment",
      color: "#F5B041",
      value: "entertainment",
      icon: (
        <MaterialCommunityIcons
          name="gamepad-variant"
          size={24}
          color="#F5B041"
        />
      ),
    },
    {
      name: "Education",
      color: "#76D7C4",
      value: "education",
      icon: <MaterialCommunityIcons name="school" size={24} color="#76D7C4" />,
    },
    {
      name: "Travel",
      color: "#FAD7A0",
      value: "travel",
      icon: (
        <MaterialCommunityIcons name="airplane" size={24} color="#FAD7A0" />
      ),
    },
    {
      name: "Savings & Investments",
      color: "#F1948A",
      value: "savings_investments",
      icon: (
        <MaterialCommunityIcons name="piggy-bank" size={24} color="#F1948A" />
      ),
    },
    {
      name: "Debt Payments",
      color: "#85C1E9",
      value: "debt_payments",
      icon: (
        <MaterialCommunityIcons
          name="credit-card-clock"
          size={24}
          color="#85C1E9"
        />
      ),
    },
    {
      name: "Gifts & Donations",
      color: "#D7BDE2",
      value: "gifts_donations",
      icon: <MaterialCommunityIcons name="gift" size={24} color="#D7BDE2" />,
    },
    {
      name: "Miscellaneous",
      color: "#E59866",
      value: "miscellaneous",
      icon: (
        <MaterialCommunityIcons name="atom-variant" size={24} color="#E59866" />
      ),
    },
  ];

  const [stages, setStages] = useState(0);
  const [transactionData, setTransactionData] = useState({
    amount: "",
    transactionDate: moment().format("YYYY-MM-DD"),
    category: "",
    description: "",
    paymentMethod: "ONLINE",
  });

  useEffect(() => {
    if (edit) {
      setTransactionData(JSON.parse(updateTransactionData));
    }
  }, []);

  const handleInputChange = (value, name) => {
    setTransactionData({ ...transactionData, [name]: value });
  };

  const modifyUpiUrl = (upiUrl, additionalParams) => {
    // Parse the existing UPI URL to extract existing parameters
    const urlParts = upiUrl?.split("?");
    const baseUrl = urlParts[0];
    const params = urlParts[1] ? urlParts[1]?.split("&") : [];

    // Create a map to store parameters
    const paramMap = {};
    params.forEach((param) => {
      const [key, value] = param?.split("=");
      paramMap[key] = value;
    });

    // Loop through additionalParams object and update URL parameters
    for (const param in additionalParams) {
      paramMap[param] = additionalParams[param];
    }

    // Construct the modified UPI URL
    const modifiedParams = Object.entries(paramMap)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    const modifiedUpiUrl = baseUrl + "?" + modifiedParams;

    // Return the modified UPI URL
    return modifiedUpiUrl;
  };
  const handelNext = async () => {
    if (
      stages === 0 &&
      transactionData.amount !== "" &&
      transactionData.amount !== "0"
    ) {
      setStages(1);
    } else if (
      transactionData.transactionDate !== "" ||
      transactionData.category !== "" ||
      transactionData.description !== ""
    ) {
      if (edit) {
        await handelUpdateTransaction(JSON.parse(updateTransactionData)?.id);
      } else {
        await handelAddTransaction();
      }
    }
  };

  const OpenUPIAPP = async () => {
    const upiUrl = data;
    const additionalParams = {
      tn: transactionData.description,
      am: transactionData.amount,
    };
    await Linking.openURL(modifyUpiUrl(upiUrl, additionalParams));
  };

  const handelUpdateTransaction = async (id) => {
    setLoading(true);
    await UpdateExpence(id, transactionData, currentUser?.token)
      .then(async (res) => {
        Toast.show({
          type: "success",
          text1: "Transaction Updated",
          text2: "Transaction Updated successfully 👋",
        });
        setLoading(false);
        router.replace("/home");
      })
      .catch((err) => {
        console.log(err);
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: err.response.data.message,
        });
        setLoading(false);
      });
  };

  const handelAddTransaction = async () => {
    setLoading(true);
    await AddExpence(transactionData, currentUser?.token)
      .then(async (res) => {
        Toast.show({
          type: "success",
          text1: "Transaction Added",
          text2: "Transaction created successfully 👋",
        });
        setLoading(false);
        console.log(data);
        if (data !== "" || data !== undefined || data !== null) {
          OpenUPIAPP();
        }
        router.replace("/home");
      })
      .catch((err) => {
        console.log(err.response.data.message);
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: err.response.data.message,
        });
        setLoading(false);
      });
  };

  const extractUpiDetails = (upiUrl) => {
    // Remove the 'upi://' part from the URL
    const paramString = upiUrl.replace("upi://", "").split("?")[1];

    // Parse parameters
    const params = {};
    if (paramString) {
      paramString.split("&").forEach((param) => {
        const [key, value] = param.split("=");
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      });
    }

    // Get UPI ID and name parameters
    const upiId = params["pa"];
    const name = params["pn"];

    return { upiId, name };
  };
  return (
    <>
      {stages === 0 ? (
        <Container>
          <Back onPress={() => router.replace("/home")}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={theme.text_primary}
            />
          </Back>
          <ScrollView>
            <Title>Add New Transaction</Title>
            {data !== "" && data !== undefined && data !== null && (
              <UPIID>
                {extractUpiDetails(data).name} - {extractUpiDetails(data).upiId}
              </UPIID>
            )}
            <Wrapper>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <FontAwesome
                  name="rupee"
                  size={28}
                  color={theme.text_secondary}
                />
                <InputField
                  value={transactionData.amount}
                  placeholder="0"
                  name="amount"
                  onChangeText={(text) => handleInputChange(text, "amount")}
                  placeholderTextColor={"#777"}
                  keyboardType="numeric"
                  autoFocus
                />
              </View>
            </Wrapper>
          </ScrollView>

          <Button
            type="filled"
            color={theme.white}
            bgcolor={theme.primary}
            // loading={loading}
            onPress={() => handelNext()}
            disabled={
              transactionData.amount === "" || transactionData.amount === "0"
            }
          >
            Continue
          </Button>
          <Toast />
        </Container>
      ) : (
        <Container>
          <Back onPress={() => setStages(0)}>
            <Ionicons
              name="chevron-back"
              size={22}
              color={theme.text_primary}
            />
          </Back>
          <Toast />
          <ScrollView>
            <Title>Transaction Details</Title>
            <Wrapper>
              <View
                style={{
                  gap: 10,
                }}
              >
                <DateInput
                  startIcon={
                    <Icon
                      name="calendar-month-outline"
                      size={24}
                      color={theme.text_secondary}
                    />
                  }
                  value={transactionData.transactionDate}
                  onChange={(date, name) =>
                    setTransactionData({
                      ...transactionData,
                      transactionDate: date,
                    })
                  }
                  label="Transaction Date"
                  placeholder="Enter your transaction date"
                  name="transactionDate"
                />
                <InputText
                  startIcon={
                    <MaterialCommunityIcons
                      name="notebook-edit"
                      size={24}
                      color={theme.text_secondary}
                    />
                  }
                  value={transactionData.description}
                  onChangeText={handleInputChange}
                  placeholder="Enter a note"
                  label="Transaction Decription"
                  name="description"
                  type={"default"}
                />
                <SelectagleItem>
                  <InputName>Transaction Category</InputName>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    {TransactionCategories.map(
                      (transactionCategories, index) => (
                        <SelectableChip
                          key={`transactionCategories-${index}`}
                          selected={
                            transactionCategories.value ===
                            transactionData.category
                          }
                          onPress={() =>
                            setTransactionData({
                              ...transactionData,
                              category: transactionCategories.value,
                            })
                          }
                          startIcon={transactionCategories.icon}
                          color={transactionCategories.color}
                        >
                          <Text> {transactionCategories.name}</Text>
                        </SelectableChip>
                      )
                    )}
                  </View>
                </SelectagleItem>
              </View>
            </Wrapper>
          </ScrollView>

          <Button
            type="filled"
            color={theme.white}
            bgcolor={theme.primary}
            loading={loading}
            onPress={() => handelNext()}
            disabled={
              transactionData.transactionDate === "" ||
              transactionData.category === "" ||
              transactionData.description === ""
            }
          >
            Continue
          </Button>
        </Container>
      )}
    </>
  );
}
