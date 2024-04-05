import { View, Text, Pressable, RefreshControl, StatusBar } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthContext } from "../../context/auth";
import styled, { useTheme } from "styled-components/native";
import React, { useEffect, useState } from "react";
import {
  GetExpenceCategory,
  GetGoalStatus,
  GetGoals,
  GetGoalsGraph,
  GetWeeklyExpence,
} from "../../api";
import Topbar from "../../components/Topbar";
import Loader from "../../components/Loader";
import GoalCard from "../../components/cards/GoalsCard";
import Button from "../../components/buttons/button";
import { router } from "expo-router";
import CategoryWiseExpence from "../../components/cards/CategoryWiseExpenceCard";
import WeeklyExpence from "../../components/cards/WeeklyExpenceCard";
import CategoryWiseGoal from "../../components/cards/CategoryWiseGoalCard";
import GoalCompletionChart from "../../components/cards/GoalCompletionChart";

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
  gap: 12px;
  padding: 12px;
`;
const TitleWrapper = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;
const Title = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

export default function Analytics() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [categoryExpence, setCategoryExpence] = useState([
    {
      text: "entertainment",
      value: 33.33,
    },
    {
      text: "food",
      value: 66.67,
    },
  ]);
  const [weeklyExpence, setweeklyExpence] = useState([]);

  const [categoryGoal, setCategoryGoal] = useState([
    {
      color: "#90EE90",
      text: "COMPLETE",
      value: 33.33,
    },
    {
      color: "#FFA500",
      text: "IN_PROGRESS",
      value: 66.67,
    },
  ]);
  const [goalCompletion, setGoalCompletion] = useState([
    [
      {
        dataPointText: "300.0",
        value: 300.0,
      },
      {
        dataPointText: "300.0",
        value: 900.0,
      },
      {
        dataPointText: "300.0",
        value: 300.0,
      },
    ],
    [
      {
        dataPointText: "200.0",
        value: 200.0,
      },
      {
        dataPointText: "300.0",
        value: 600.0,
      },
      {
        dataPointText: "300.0",
        value: 900.0,
      },
    ],
  ]);
  const { signOut, currentUser } = useAuthContext();

  const getWeeklyExpences = async () => {
    setLoading(true);
    await GetWeeklyExpence(currentUser?.token)
      .then((res) => {
        setLoading(false);
        setweeklyExpence(res?.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const getExpenceCategory = async () => {
    setLoading(true);
    await GetExpenceCategory(currentUser?.token)
      .then((res) => {
        setLoading(false);
        setCategoryExpence(res?.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const getGoalStatus = async () => {
    setLoading(true);
    await GetGoalStatus(currentUser?.token)
      .then((res) => {
        setLoading(false);
        setCategoryGoal(res?.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const getGoalGraph = async () => {
    setLoading(true);
    await GetGoalsGraph(currentUser?.token)
      .then((res) => {
        setLoading(false);
        console.log(res?.data);
        setGoalCompletion(res?.data?.lineData);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getWeeklyExpences();
    getGoalStatus();
    // getGoalGraph();
    getExpenceCategory();
  }, []);

  const onRefresh = React.useCallback(() => {
    getWeeklyExpences();
    getGoalStatus();
    // getGoalGraph();
    getExpenceCategory();
  }, []);

  return (
    <Container
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
    >
      <Wrapper>
        <StatusBar
          barStyle={"dark-content"}
          backgroundColor={theme.bg} // Set the status bar color based on the theme
        />
        <Topbar />

        <View
          style={{
            height: 10,
          }}
        ></View>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Section>
              <TitleWrapper>
                <Title>Analytics</Title>
              </TitleWrapper>
              <WeeklyExpence data={weeklyExpence} />
              <CategoryWiseExpence data={categoryExpence} />
              <GoalCompletionChart data={goalCompletion} />
              <CategoryWiseGoal data={categoryGoal} />
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
}
