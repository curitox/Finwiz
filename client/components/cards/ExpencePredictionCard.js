import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text,
  ImageBackground,
} from "react-native";
import styled, { css, useTheme } from "styled-components/native";
import BgImage from "../../assets/icons/pattern.png";
import { LinearGradient } from "expo-linear-gradient";
import { PieChart } from "react-native-gifted-charts";
import { Feather } from "@expo/vector-icons";
import { getCategoryByValue } from "../../utils/data";

const Card = styled.View`
  flex: 1;
  position: relative;
  flex-direction: column;
  border-radius: 12px;
  background: ${({ theme }) => theme.mainCard};
  elevation: 1;
  overflow: hidden; /* Added to ensure ImageBg doesn't overflow */
`;

const ImageBg = styled.ImageBackground`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.5;
`;
const Wrapper = styled.View`
  position: relative;
  flex: 1;
  gap: 8px;
  flex-direction: column;
  border-radius: 20px;
  padding: 12px 16px;
`;
const Section = styled.View`
  flex: 1;
  flex-direction: row;
  gap: 18px;
`;

const Right = styled.View`
  flex: 1;
  gap: 14px;
`;
const Left = styled.View`
  justify-content: center;
`;
const Title = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.gold};
`;
const Desc = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.white + 90};
`;
const Value = styled.Text`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.white};
`;
const Item = styled.View`
  flex-direction: row;
  font-size: 10px;
  align-items: center;
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
      }}
    />
  );
};

const ExpencePredictionCard = ({ futureExpence }) => {
  const theme = useTheme();

  return (
    <Card style={{ elevation: 1 }}>
      <ImageBg source={BgImage} resizeMode="cover" />
      <Wrapper>
        <View
          style={{
            gap: 2,
          }}
        >
          <Title>Expence Prediction</Title>
          <Desc>
            Based on your past 2 months expences, here are your projected
            expence for next month.
          </Desc>
        </View>
        <Section>
          <Left>
            {futureExpence?.predictions && (
              <PieChart
                data={
                  (futureExpence?.predictions && futureExpence?.predictions) ||
                  []
                }
                donut
                radius={60}
                innerRadius={30}
                focusOnPress
                innerCircleColor={theme.mainCard}
              />
            )}
          </Left>
          <Right>
            <View
              style={{
                gap: 10,
              }}
            >
              <Text
                style={{
                  color: theme.white,
                  fontSize: 12,
                }}
              >
                Accuracy:-{" "}
                <Text
                  style={{
                    color: theme.green,
                    fontSize: 12,
                  }}
                >
                  {futureExpence?.accuracy?.toFixed(2)}%
                </Text>
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {futureExpence?.predictions?.map((item, index) => (
                  <Item key={`chart-card-insight-${item?.name}-${index}`}>
                    {renderDot(item?.color)}
                    <Text
                      style={{
                        color: theme.white,
                        fontSize: 11,
                      }}
                    >
                      {getCategoryByValue(item?.name)?.name} - ₹{""}
                      {item?.value?.toFixed(2)}
                    </Text>
                  </Item>
                ))}
              </View>
            </View>
          </Right>
        </Section>
      </Wrapper>
    </Card>
  );
};

export default ExpencePredictionCard;
