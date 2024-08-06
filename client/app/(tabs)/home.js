import React, { useEffect, useState } from "react";
import { View, RefreshControl, Text, StatusBar, Image } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useThemeContext } from "../../context/themeContext";
import { useRouter } from "expo-router";
import Button from "../../components/buttons/button";
import NavigationCards from "../../components/cards/NavigationCards";
import ChartCard from "../../components/cards/ChartCard";
import Topbar from "../../components/Topbar";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import GoalCard from "../../components/cards/GoalsCard";
import TextButton from "../../components/buttons/textButton";
import TransactionsCard from "../../components/cards/Transactions";
import {
  GetExpences,
  GetGoals,
  GetYearlyExpences,
  MonthsChart,
  TodaysChart,
} from "../../api";
import Loader from "../../components/Loader";
import InvestmentPredictor from "../../components/InvestmentPredictor";
import NoTransactionsFound from "../../assets/images/NoTransactionsFound.png";
import Oops from "../../assets/images/Oops.png";
import moment from "moment";
import { useAuthContext } from "../../context/auth";

const Container = styled.ScrollView`
  padding: 32px 0px;
  padding: 32px 0px;
  background-color: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.SafeAreaView`
  flex: 1;
  gap: -6px;
`;

const Section = styled.View`
  flex: 1;
  gap: 14px;
  padding: 12px;
`;
const TitleWrapper = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;
const Title = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;
const CardWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const GoalsWrapper = styled.ScrollView`
  gap: 16px;
  flex: 1;
`;

const TransactionCardWrapper = styled.View`
  flex-direction: column;
`;

const Month = styled.Text`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Home = () => {
  const router = useRouter();
  const theme = useTheme();
  const themeMode = useThemeContext();
  const [loading, setLoading] = useState(true);
  const { appTheme } = useThemeContext();
  const [year, setYear] = useState(moment().format("YYYY"));
  const [error, setError] = useState();
  const [expences, setExpences] = useState([]);
  const [prevMonth, setPrevMonth] = useState([]);
  const [goals, setGoals] = useState([]);
  const [chartData, setChartData] = useState({});
  const [chartDataMonth, setChartDataMonth] = useState({});

  const onRefresh = React.useCallback(() => {
    getExpences();
    getGoals();
    getExpencesChart();
    getExpencesChartMonth();
    getPreviousMonth();
  }, []);

  const categories = [
    {
      id: 1,
      text: "Add Transaction",
      link: "/add-transactions",
      icon: (
        <MaterialIcons
          name="library-add"
          size={24}
          color={theme.categoryGreen}
        />
      ),
      background: theme.categoryGreenLight,
      color: theme.categoryGreen,
    },
    {
      id: 2,
      text: "Create Goals",
      link: "/add-goals",
      icon: (
        <MaterialCommunityIcons
          name="medal"
          size={24}
          color={theme.categoryYellow}
        />
      ),
      background: theme.categoryYellowLight,
      color: theme.categoryYellow,
    },
    {
      id: 3,
      text: "AI Insights",
      link: "/ai-insights",
      icon: (
        <MaterialCommunityIcons
          name="robot"
          size={24}
          color={theme.categoryViolet}
        />
      ),
      background: theme.categoryVioletLight,
      color: theme.categoryViolet,
    },
    {
      id: 4,
      text: "Investment",
      link: null,
      bottomSheet: <InvestmentPredictor />,
      icon: (
        <MaterialCommunityIcons
          name="hand-coin"
          size={22}
          color={theme.categoryBlue}
        />
      ),
      background: theme.categoryBlueLight,
      color: theme.categoryBlue,
    },
  ];

  const { currentUser } = useAuthContext();

  const getExpences = async () => {
    setError("");
    setLoading(true);
    await GetExpences(currentUser?.token)
      .then((res) => {
        setError("");
        setExpences(res?.data?.Expenses);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const getPreviousMonth = async () => {
    setError("");
    setLoading(true);
    await GetYearlyExpences(year, currentUser?.token)
      .then((res) => {
        setError("");
        setPrevMonth(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const getGoals = async () => {
    setError("");
    setLoading(true);
    await GetGoals(currentUser?.token)
      .then((res) => {
        setGoals(res?.data);
        setError("");
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const getExpencesChart = async () => {
    setError("");
    setLoading(true);
    await TodaysChart(currentUser?.token)
      .then((res) => {
        setError("");
        setChartData(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };
  const getExpencesChartMonth = async () => {
    setError("");
    setLoading(true);
    await MonthsChart(currentUser?.token)
      .then((res) => {
        setError("");
        setChartDataMonth(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  useEffect(() => {
    getExpences();
    getGoals();
    getExpencesChart();
    getExpencesChartMonth();
    getPreviousMonth();
  }, []);

  return (
    <Container
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
    >
      <Wrapper>
        <StatusBar
          barStyle={appTheme === "light" ? "dark-content" : "light-content"}
          backgroundColor={theme.bg} // Set the status bar color based on the theme
        />
        <Topbar />
        {loading ? (
          <Loader />
        ) : (
          <>
            {error ? (
              <>
                <View style={{ flex: 1 }}>
                  <TransactionCardWrapper
                    style={{
                      gap: 12,
                      height: 800,
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
                  </TransactionCardWrapper>
                </View>
              </>
            ) : (
              <>
                <Section>
                  <GoalsWrapper
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    {chartData !== null &&
                      chartData !== undefined &&
                      chartData && <ChartCard chartData={chartData} />}
                    {chartDataMonth !== null &&
                      chartDataMonth !== undefined && (
                        <ChartCard chartData={chartDataMonth} month />
                      )}
                  </GoalsWrapper>
                </Section>
                <Section>
                  <Title>Quick Links</Title>
                  <CardWrapper>
                    {categories.map((item) => (
                      <NavigationCards data={item} key={item.id} />
                    ))}
                  </CardWrapper>
                </Section>
                {goals?.length > 0 && (
                  <Section>
                    <TitleWrapper>
                      <Title>Goals</Title>

                      <TextButton
                        small
                        label="View All"
                        color={theme.primary}
                        disabled={false}
                        enabled={true}
                        onPress={() => router.replace("/goals")}
                      />
                    </TitleWrapper>
                    <GoalsWrapper
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    >
                      {goals?.map((item) => (
                        <GoalCard key={`goal-home-${item?.id}`} item={item} />
                      ))}
                    </GoalsWrapper>
                  </Section>
                )}
                <Section>
                  <Title>Transactions</Title>

                  {expences.length === 0 ? (
                    <TransactionCardWrapper
                      style={{
                        gap: 12,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          width: 200,
                          height: 200,
                        }}
                        source={NoTransactionsFound}
                      />
                      <Text
                        style={{
                          color: theme.text_secondary,
                        }}
                      >
                        No Transactions Found Today
                      </Text>
                      <Button
                        micro
                        filled
                        color={theme.white}
                        bgcolor={theme.primary}
                        startIcon={
                          <MaterialIcons
                            name="add"
                            size={14}
                            color={theme.white}
                          />
                        }
                        onPress={() => router.replace("/add-transactions")}
                      >
                        Add new Transaction
                      </Button>
                    </TransactionCardWrapper>
                  ) : (
                    <>
                      <Month>Today</Month>
                      <TransactionCardWrapper>
                        {expences?.map((item) => (
                          <TransactionsCard
                            item={item}
                            key={`expence-home-${item?.category}-${item?.id}`}
                          />
                        ))}
                      </TransactionCardWrapper>
                    </>
                  )}
                  {prevMonth.length > 0 && (
                    <>
                      <Month>{prevMonth[0]?.month}</Month>

                      <TransactionCardWrapper style={{ gap: 0 }}>
                        {prevMonth[0]?.transactions?.map((transactions) => (
                          <TransactionsCard
                            item={transactions}
                            key={`expence-transactions-${transactions?.category}-${transactions?.id}`}
                          />
                        ))}
                      </TransactionCardWrapper>
                    </>
                  )}
                </Section>
              </>
            )}
          </>
        )}

        <View
          style={{
            height: 90,
          }}
        ></View>
      </Wrapper>
    </Container>
  );
};

export default Home;
