import { View, Text, Pressable, RefreshControl, StatusBar } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthContext } from "../../context/auth";
import styled, { useTheme } from "styled-components/native";
import React, { useEffect, useState } from "react";
import { GetGoals } from "../../api";
import Topbar from "../../components/Topbar";
import Loader from "../../components/Loader";
import GoalCard from "../../components/cards/GoalsCard";
import Button from "../../components/buttons/button";
import { router } from "expo-router";

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
  gap: 16px;
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

const GoalsCardWrapper = styled.View`
  flex-direction: column;
  gap: 6px;
`;

export default function Accout() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const { signOut, currentUser } = useAuthContext();

  const getGoals = async () => {
    setLoading(true);
    await GetGoals(currentUser?.token)
      .then((res) => {
        console.log("Goals", res.data);
        setLoading(false);
        setGoals(res?.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getGoals();
  }, []);

  const onRefresh = React.useCallback(() => {
    getGoals();
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
                <Title>Current Goals ({goals?.length})</Title>
                <View>
                  <Button
                    micro
                    filled
                    color={theme.white}
                    bgcolor={theme.primary}
                    startIcon={
                      <MaterialIcons name="add" size={14} color={theme.white} />
                    }
                    onPress={() => router.replace("/add-goals")}
                  >
                    New Goal
                  </Button>
                </View>
              </TitleWrapper>
              <GoalsCardWrapper>
                {goals?.map((item) => (
                  <GoalCard key={`goal-goals-${item?.id}`} item={item} full />
                ))}
              </GoalsCardWrapper>
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
