import { View, Text, Pressable, Linking } from "react-native";
import { Link, router, useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
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
import { AddGoal, BudgetAnalysis, GetPersonalizedInsight } from "../../api";
import moment from "moment";
import Toast from "react-native-toast-message";
import ExpencePredictionCard from "../../components/cards/ExpencePredictionCard";
import PersonalizedInsight from "../../components/cards/PersonalizedInsightCard";
import BudgetRecomendations from "../../components/cards/BudgetRecomendations";
import Loader from "../../components/Loader";

const Container = styled.ScrollView`
  flex: 1;
  gap: 12px;
  padding: 42px 16px 16px 16px;
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
  font-weight: 600;
  font-size: 24px;
  margin-top: 12px;
  color: ${({ theme }) => theme.text_primary};
`;

const Wrapper = styled.View`
  flex: 1;
  justify-content: space-between;
  padding: 18px 0px 8px 0px;
  gap: 22px;
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

export default function AIinsights() {
  const router = useRouter();
  const theme = useTheme();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [budgetRecomendation, setBudgetRecomendation] = useState([]);
  const [personalizedInsight, setPersonalizedInsight] = useState({
    insights: [
      {
        category: "entertainment",
        total_expense: "400.00",
      },
      {
        category: "transportation",
        total_expense: "200.00",
      },
      {
        category: "gifts_donations",
        total_expense: "50.00",
      },
      {
        category: "miscellaneous",
        total_expense: 0,
      },
      {
        category: "shopping",
        total_expense: 0,
      },
      {
        category: "travel",
        total_expense: 0,
      },
    ],
    max_category: "food",
    max_expense: "950.00",
    message: "Expenditure is within limits.",
    showData: true,
  });
  const { currentUser } = useAuthContext();

  const getPersonalizedInsight = async () => {
    setError("");
    setLoading(true);
    await GetPersonalizedInsight(currentUser?.token)
      .then((res) => {
        setError("");
        setPersonalizedInsight(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const getBudgetRecomendation = async () => {
    setError("");
    setLoading(true);
    await BudgetAnalysis(currentUser?.token)
      .then((res) => {
        setError("");
        setBudgetRecomendation(res?.data?.recommended_categories);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  useEffect(() => {
    getBudgetRecomendation();
    // getPersonalizedInsight();
  }, []);

  return (
    <>
      <Container>
        <Back onPress={() => router.replace("/home")}>
          <Ionicons name="chevron-back" size={22} color={theme.text_primary} />
        </Back>
        <Toast />
        {loading ? (
          <Loader />
        ) : (
          <>
            <Title>AI Insights</Title>
            <Wrapper>
              <View
                style={{
                  gap: 10,
                }}
              >
                <ExpencePredictionCard />
                <PersonalizedInsight
                  personalizedInsight={personalizedInsight}
                />
                <BudgetRecomendations
                  budgetRecomendation={budgetRecomendation}
                />
              </View>
            </Wrapper>
          </>
        )}
      </Container>
    </>
  );
}
