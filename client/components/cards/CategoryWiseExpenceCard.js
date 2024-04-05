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
import { Feather } from "@expo/vector-icons";
import { ProgressBar, Colors } from "react-native-paper";
import { Card } from "react-native-paper";
import { useBottomSheetContext } from "../../context/bottomSheetContext";
import GoalsDetails from "../GoalsDetails";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import { PieChart } from "react-native-gifted-charts";
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

const Right = styled.View`
  flex: 1;
  gap: 14px;
  justify-content: center;
`;
const Left = styled.View`
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-weight: 500;
  font-size: 15px;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.text_primary + 90};
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

const CategoryWiseExpence = ({ data }) => {
  const theme = useTheme();
  return (
    <CardContainer elevation={0.5}>
      <Wrapper>
        <View
          style={{
            gap: 1,
          }}
        >
          <Title>Expences Category</Title>
          <Desc>Analysis of your different expence categories</Desc>
        </View>
        <Left>
          <PieChart data={data} radius={90} focusOnPress />
        </Left>
        <Right>
          <View
            style={{
              flex: 1,
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {data?.map((item, index) => (
              <Item key={`chart-card-home-${item?.text}-${index}`}>
                {renderDot(getCategoryByValue(item?.text)?.color)}
                <Text
                  style={{
                    color: theme.text_secondary,
                    fontSize: 12,
                  }}
                >
                  {getCategoryByValue(item?.text)?.name}
                </Text>
              </Item>
            ))}
          </View>
        </Right>
      </Wrapper>
    </CardContainer>
  );
};

export default CategoryWiseExpence;
