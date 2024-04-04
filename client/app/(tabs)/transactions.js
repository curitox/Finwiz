import { View, Text, Pressable, StatusBar, RefreshControl } from "react-native";
import { Link } from "expo-router";
import moment from "moment";
import { useAuthContext } from "../../context/auth";
import Loader from "../../components/Loader";
import { useTheme } from "react-native-paper";
import Topbar from "../../components/Topbar";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import TransactionsCard from "../../components/cards/Transactions";
import { GetYearlyExpences } from "../../api";

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
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;
const Monthcard = styled.View`
  gap: 12px;
  padding: 2px;
`;
const Month = styled.Text`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const TransactionCardWrapper = styled.View`
  flex-direction: column;
  gap: 12px;
`;

export default function Transactions() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(moment().format("YYYY"));
  const [expences, setExpences] = useState([]);
  const { signOut, currentUser } = useAuthContext();

  const getExpences = async () => {
    setLoading(true);
    await GetYearlyExpences(year, currentUser?.token)
      .then((res) => {
        setLoading(false);
        setExpences(res?.data);
        console.log(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getExpences();
  }, []);

  const onRefresh = React.useCallback(() => {
    getExpences();
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
              <Title>Transaction History</Title>
              <TransactionCardWrapper>
                {expences?.map((item) => (
                  <Monthcard key={`expence-transactions-${item?.month}`}>
                    <Month>{item?.month}</Month>

                    <TransactionCardWrapper style={{ gap: 0 }}>
                      {item?.transactions?.map((transactions) => (
                        <TransactionsCard
                          item={transactions}
                          key={`expence-transactions-${transactions?.category}-${transactions?.id}`}
                        />
                      ))}
                    </TransactionCardWrapper>
                  </Monthcard>
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
}
