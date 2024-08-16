import {
  View,
  Text,
  Pressable,
  RefreshControl,
  StatusBar,
  Image,
} from "react-native";
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
import NoGoalImage from "../../assets/images/Goal.png";
import Oops from "../../assets/images/Oops.png";

const Container = styled.ScrollView`
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
  const [error, setError] = useState();
  const { signOut, currentUser } = useAuthContext();

  const getGoals = async () => {
    setError("");
    setLoading(true);
    await GetGoals(currentUser?.token)
      .then((res) => {
        setError("");
        setLoading(false);
        setGoals(res?.data);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
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
                  <GoalsCardWrapper
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
                  </GoalsCardWrapper>
                </View>
              </>
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
                          <MaterialIcons
                            name="add"
                            size={14}
                            color={theme.white}
                          />
                        }
                        onPress={() => router.replace("/add-goals")}
                      >
                        New Goal
                      </Button>
                    </View>
                  </TitleWrapper>

                  {goals.length === 0 ? (
                    <GoalsCardWrapper
                      style={{
                        gap: 12,
                        height: 500,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          width: 200,
                          height: 200,
                        }}
                        source={NoGoalImage}
                      />
                      <Text
                        style={{
                          color: theme.text_secondary,
                        }}
                      >
                        No Current Goals Found
                      </Text>
                    </GoalsCardWrapper>
                  ) : (
                    <GoalsCardWrapper>
                      {goals?.map((item) => (
                        <GoalCard
                          key={`goal-goals-${item?.id}`}
                          item={item}
                          full
                        />
                      ))}
                    </GoalsCardWrapper>
                  )}
                </Section>
              </>
            )}
          </>
        )}

        <View
          style={{
            height: 120,
          }}
        ></View>
    </Container>
  );
}
