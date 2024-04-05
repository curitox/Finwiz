import {
  View,
  Text,
  Pressable,
  RefreshControl,
  Image,
  StatusBar,
} from "react-native";
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
import Oops from "../../assets/images/Oops.png";

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
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [categoryExpence, setCategoryExpence] = useState([]);
  const [weeklyExpence, setweeklyExpence] = useState([]);
  const [categoryGoal, setCategoryGoal] = useState([]);
  const [goalCompletion, setGoalCompletion] = useState([]);
  const { signOut, currentUser } = useAuthContext();

  const getWeeklyExpences = async () => {
    setError("");
    setLoading(true);
    await GetWeeklyExpence(currentUser?.token)
      .then((res) => {
        setweeklyExpence(res?.data);
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };
  const getExpenceCategory = async () => {
    setLoading(true);
    setError("");
    await GetExpenceCategory(currentUser?.token)
      .then((res) => {
        setCategoryExpence(res?.data);
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };
  const getGoalStatus = async () => {
    setError("");
    setLoading(true);
    await GetGoalStatus(currentUser?.token)
      .then((res) => {
        setCategoryGoal(res?.data);
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };
  const getGoalGraph = async () => {
    setError("");
    setLoading(true);
    await GetGoalsGraph(currentUser?.token)
      .then((res) => {
        setGoalCompletion(res?.data?.lineData);
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
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
            {error ? (
              <>
                <View style={{ flex: 1 }}>
                  <Section
                    style={{
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
                  </Section>
                </View>
              </>
            ) : (
              <Section>
                <TitleWrapper>
                  <Title>Analytics</Title>
                </TitleWrapper>
                <WeeklyExpence data={weeklyExpence} />
                <CategoryWiseExpence data={categoryExpence} />
                <GoalCompletionChart data={goalCompletion} />
                <CategoryWiseGoal data={categoryGoal} />
              </Section>
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
}
