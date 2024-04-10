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
import moment from "moment";
import { Card } from "react-native-paper";

const CardWrapper = styled(Card)`
  flex: 1;
  width: 360px;
  min-height: 200px;
  margin: 2px 4px 8px 4px;
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
  min-height: 250px;
`;
const Wrapper = styled.View`
  position: relative;
  flex: 1;
  gap: 8px;
  flex-direction: column;
  border-radius: 20px;
  padding: 12px 16px;
  min-height: 200px;
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
  font-size: 10px;
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
        height: 6,
        width: 6,
        borderRadius: 5,
        backgroundColor: color,
        marginRight: 5,
      }}
    />
  );
};

const ChartCard = ({ chartData, month }) => {
  const theme = useTheme();

  return (
    <CardWrapper elevation={0.5}>
      <ImageBg source={BgImage} resizeMode="cover" />
      <Wrapper>
        <View
          style={{
            gap: 2,
          }}
        >
          <Title>{month ? "Current Months Expences" : "Todays Expences"}</Title>
          <Desc>
            {month
              ? `Detailed insight of "${moment().format("MMMM")}" Expences`
              : "Detailed insight of your todays Expences"}{" "}
          </Desc>
        </View>
        <Section>
          <Left>
            {chartData && (
              <PieChart
                data={(chartData?.data && chartData?.data) || []}
                donut
                isAnimated
                radius={50}
                innerRadius={34}
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Value>
                  ₹
                  {chartData?.total_amount > 0
                    ? Math.trunc(chartData?.total_amount)
                    : 0}
                </Value>
                <Feather
                  name="arrow-down-circle"
                  size={18}
                  color={theme.green}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexWrap: "wrap",
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                {chartData?.data?.map((item, index) => (
                  <Item key={`chart-card-home-${item?.name}-${index}`}>
                    {renderDot(getCategoryByValue(item?.name)?.color)}
                    <Text
                      style={{
                        color: theme.white,
                        fontSize: 10,
                      }}
                    >
                      {getCategoryByValue(item?.name)?.name}
                    </Text>
                  </Item>
                ))}
              </View>
            </View>
          </Right>
        </Section>
      </Wrapper>
    </CardWrapper>
  );
};

export default ChartCard;
