import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text,
  ImageBackground,
} from "react-native";
import styled, { css, useTheme } from "styled-components/native";
import { Card } from "react-native-paper";
import { getCategoryByValue } from "../../utils/data";

const CardContainer = styled(Card)`
  flex: 1;
  margin: 2px 12px 8px 4px;
  flex-direction: column;
  border-radius: 12px;
  gap: 6px;
  background-color: ${({ theme }) => theme.bg};
`;

const Wrapper = styled(Card.Content)`
  flex: 1;
  gap: 12px;
  border-radius: 20px;
  padding: 18px 16px;
`;

const Title = styled.Text`
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;

const renderDot = (color) => {
  return (
    <View
      style={{
        height: 8,
        width: 8,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 5,
        marginTop: 10,
      }}
    />
  );
};

const BudgetRecomendations = ({ budgetRecomendation, loading }) => {
  const theme = useTheme();
  return (
    <CardContainer elevation={0.5}>
      <Wrapper>
        <View
          style={{
            gap: 1,
          }}
        >
          <Title>Budget Recomendations</Title>
          <Desc>
            Our recomendations to optimize your budgets based on spending habits
            categories on which your most spending takes places.
          </Desc>
        </View>

        {loading ? (
          <View
            style={{
              gap: 4,
              flexDirection: "row",
              height: 100,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color={theme.text_primary} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: theme.text_primary,
              }}
            >
              Generating recomendations
            </Text>
          </View>
        ) : (
          <View
            style={{
              gap: 1,
              flexDirection: "column",
              gap: 4,
              padding: 4,
            }}
          >
            {budgetRecomendation?.map((item, index) => (
              <View
                key={`budget+${index}`}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                {renderDot(getCategoryByValue(item[0])?.color)}
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: theme.text_primary,
                    }}
                  >
                    {index === 0
                      ? "Your frequently spend in the"
                      : "Next spending is"}{" "}
                    <Text
                      style={{
                        fontWeight: 500,
                        fontSize: 14,
                        color: theme.text_primary,
                      }}
                    >
                      {getCategoryByValue(item[0])?.name}
                    </Text>{" "}
                    category which is around{" "}
                    <Text
                      style={{
                        fontWeight: 500,
                        fontSize: 14,
                        color: theme.text_primary,
                      }}
                    >
                      {item[1]?.toFixed(2)}%
                    </Text>{" "}
                    of your top spended category.
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </Wrapper>
    </CardContainer>
  );
};

export default BudgetRecomendations;
