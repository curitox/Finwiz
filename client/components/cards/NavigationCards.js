import React from "react";
import { TouchableOpacity, ActivityIndicator, View, Text } from "react-native";
import styled, { css } from "styled-components/native";

const Card = styled.TouchableOpacity`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const CardIcon = styled.View`
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
  background: ${({ background }) => background};
  color: ${({ color }) => color};
  border-radius: 50px;
`;
const CardText = styled.Text`
  font-size: 10px;
  color: ${({ theme }) => theme.text_primary};
`;
const NavigationCards = ({ data }) => {
  return (
    <Card>
      <CardIcon background={data.background} color={data.color}>
        {data.icon}
      </CardIcon>
      <CardText>{data.text}</CardText>
    </Card>
  );
};

export default NavigationCards;
