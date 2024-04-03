import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableHighlightBase,
  Linking,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styled, { useTheme } from "styled-components/native";
import { useThemeContext } from "../../context/themeContext";
import { router, useRouter } from "expo-router";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { useAuthContext } from "../../context/auth";
import Button from "../../components/buttons/button";
import NavigationCards from "../../components/cards/NavigationCards";
import { Categories } from "../../utils/data";
import ChartCard from "../../components/cards/ChartCard";
import Topbar from "../../components/Topbar";
import { Entypo } from "@expo/vector-icons";
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import GoalCard from "../../components/cards/GoalsCard";
import TextButton from "../../components/buttons/textButton";
import TransactionsCard from "../../components/cards/Transactions";
import { GetExpences, GetGoals, TodaysChart } from "../../api";
import Loader from "../../components/Loader";

const Container = styled.ScrollView`
  flex: 1;
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

const Home = () => {
  const router = useRouter();
  const theme = useTheme();
  const themeMode = useThemeContext();
  const [loading, setLoading] = useState(false);
  const { toggleTheme } = useThemeContext();
  const [expences, setExpences] = useState([]);
  const [goals, setGoals] = useState([]);
  const [chartData, setChartData] = useState({});

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
      link: "/investment",
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
    setLoading(true);
    await GetExpences(currentUser?.token)
      .then((res) => {
        setLoading(false);
        setExpences(res?.data?.Expenses);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const getGoals = async () => {
    setLoading(true);
    await GetGoals(currentUser?.token)
      .then((res) => {
        setLoading(false);
        setGoals(res?.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getExpencesChart = async () => {
    setLoading(true);
    await TodaysChart(currentUser?.token)
      .then((res) => {
        setLoading(false);
        setChartData(res?.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getExpences();
    getGoals();
    getExpencesChart();
  }, []);

  return (
    <Container>
      <Wrapper>
        <StatusBar
          barStyle={"dark-content"}
          backgroundColor={theme.bg} // Set the status bar color based on the theme
        />
        <Topbar />

        {loading ? (
          <Loader />
        ) : (
          <>
            <Section>
              {chartData !== null && chartData !== undefined && (
                <ChartCard chartData={chartData} />
              )}
            </Section>
            <Section>
              <Title>Quick Links</Title>
              <CardWrapper>
                {categories.map((item) => (
                  <NavigationCards data={item} key={item.id} />
                ))}
              </CardWrapper>
            </Section>
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
            <Section>
              <Title>Transactions</Title>
              <TransactionCardWrapper>
                {expences?.map((item) => (
                  <TransactionsCard
                    item={item}
                    key={`expence-home-${item?.category}-${item?.id}`}
                  />
                ))}
              </TransactionCardWrapper>
            </Section>
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
