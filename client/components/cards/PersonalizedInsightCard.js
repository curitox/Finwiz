import React from "react";
import { Text, View } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { Card } from "react-native-paper";
import { getCategoryByValue } from "../../utils/data";

const CardContainer = styled(Card)`
  flex: 1;
  margin: 2px 12px 8px 4px;
  flex-direction: column;
  border-radius: 12px;
  gap: 6px;
  background-color: ${({ theme }) => theme.card};
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
        marginTop: 5,
      }}
    />
  );
};
const PersonalizedInsight = ({ personalizedInsight }) => {
  const theme = useTheme();
  return (
    <CardContainer elevation={0.5}>
      <Wrapper>
        <View
          style={{
            gap: 1,
          }}
        >
          <Title>Personalized Insights</Title>
          <Desc>
            Based on your spending habits amount, here are some insights to help
            you manage your finance better.
          </Desc>
        </View>
        {personalizedInsight?.showData ? (
          <View
            style={{
              gap: 1,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                color: theme.text_primary,
              }}
            >
              Maximum Spent Category:{" "}
              {getCategoryByValue(personalizedInsight?.max_category)?.name}
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                color: theme.text_primary,
              }}
            >
              Maximum Expence: ₹{personalizedInsight?.max_expense}
            </Text>

            <View
              style={{
                gap: 1,
                flexDirection: "row",
                gap: 4,
                padding: 4,
              }}
            >
              {renderDot(
                getCategoryByValue(personalizedInsight?.insights[0]?.category)
                  ?.color
              )}
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
                  You have spent mostly in{" "}
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: 14,
                      color: theme.text_primary,
                    }}
                  >
                    {
                      getCategoryByValue(
                        personalizedInsight?.insights[0]?.category
                      )?.name
                    }
                  </Text>{" "}
                  category which is around{" "}
                  <Text
                    style={{
                      fontWeight: 500,
                      fontSize: 14,
                      color: theme.text_primary,
                    }}
                  >
                    ₹{personalizedInsight?.insights[0]?.total_expense}
                  </Text>{" "}
                  , you can try to reduce spending in these category to stay in
                  the budget
                </Text>
              </View>
            </View>

            <View
              style={{
                gap: 1,
                gap: 4,
                padding: 4,
              }}
            >
              {personalizedInsight?.insights?.length > 1 && (
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
                    Some other Categories are:
                  </Text>
                  {personalizedInsight?.insights?.map((item, index) => (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        gap: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      {renderDot(getCategoryByValue(item?.category)?.color)}
                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: theme.text_secondary,
                            padding: "8px 0px",
                          }}
                        >
                          {getCategoryByValue(item?.category)?.name}
                          {" - "}₹{item?.total_expense}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
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
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                color: theme.text_primary,
              }}
            >
              Based on your current expences you are good to go! Your
              Expenditures are within the limits! We will notify you if you are
              spending more than the limits.
            </Text>
          </View>
        )}
      </Wrapper>
    </CardContainer>
  );
};

export default PersonalizedInsight;
