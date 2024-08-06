import { View, Text, RefreshControl, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuthContext } from "../../context/auth";
import styled, { useTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  BudgetAnalysis,
  GetPersonalizedInsight,
  Predict_Future_expences,
} from "../../api";
import Toast from "react-native-toast-message";
import ExpencePredictionCard from "../../components/cards/ExpencePredictionCard";
import PersonalizedInsight from "../../components/cards/PersonalizedInsightCard";
import BudgetRecomendations from "../../components/cards/BudgetRecomendations";
import Loader from "../../components/Loader";
import Oops from "../../assets/images/Oops.png";

const Container = styled.ScrollView`
  flex: 1;
  gap: 12px;
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

export default function AIinsights() {
  const router = useRouter();
  const theme = useTheme();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [FutureExpenceLoading, setFutureExpenceLoading] = useState(true);
  const [budgetLoading, setbudgetLoading] = useState(true);
  const [budgetRecomendation, setBudgetRecomendation] = useState([]);
  const [personalizedInsight, setPersonalizedInsight] = useState();
  const [futureExpence, setfutureExpence] = useState();
  const { currentUser } = useAuthContext();

  const getFutureExpences = async () => {
    setError("");
    setLoading(true);
    setFutureExpenceLoading(true);
    await Predict_Future_expences(currentUser?.token)
      .then((res) => {
        setError("");
        setfutureExpence(res?.data);
        setFutureExpenceLoading(false);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setFutureExpenceLoading(false);
        setError(err.message);
      });
  };

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
    setbudgetLoading(true);
    await BudgetAnalysis(currentUser?.token)
      .then((res) => {
        setError("");
        setBudgetRecomendation(res?.data?.recommended_categories);
        setLoading(false);
        setbudgetLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setbudgetLoading(false);
        setError(err.message);
      });
  };

  useEffect(() => {
    getBudgetRecomendation();
    getPersonalizedInsight();
    getFutureExpences();
  }, []);

  const onRefresh = React.useCallback(() => {
    getBudgetRecomendation();
    getPersonalizedInsight();
    getFutureExpences();
  }, []);

  return (
    <>
      <Container
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      >
        <Back onPress={() => router.replace("/home")}>
          <Ionicons name="chevron-back" size={22} color={theme.text_primary} />
        </Back>
        <Toast />
        {loading ? (
          <Loader />
        ) : (
          <>
            {error ? (
              <>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "column",
                      gap: 12,
                      height: 600,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{
                        width: 300,
                        height: 300,
                      }}
                      source={Oops}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: theme.red,
                      }}
                    >
                      {error}
                    </Text>
                    <Text
                      style={{
                        color: theme.text_primary,
                      }}
                    >
                      Please refresh the page again !
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                <Title>AI Insights</Title>
                <Wrapper>
                  <View
                    style={{
                      gap: 10,
                    }}
                  >
                    <ExpencePredictionCard
                      futureExpence={futureExpence}
                      loading={FutureExpenceLoading}
                    />
                    <PersonalizedInsight
                      personalizedInsight={personalizedInsight}
                    />
                    <BudgetRecomendations
                      budgetRecomendation={budgetRecomendation}
                      loading={budgetLoading}
                    />
                  </View>
                </Wrapper>
              </>
            )}
            <View style={{ marginBottom: 70 }}></View>
          </>
        )}
      </Container>
    </>
  );
}
