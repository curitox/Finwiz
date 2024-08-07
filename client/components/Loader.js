import React, { useEffect, useState } from "react";
import styled, { css, useTheme } from "styled-components/native";
import { Card, Text } from "react-native-paper";
import { ActivityIndicator } from "react-native";

const Container = styled.View`
  flex: 1;
  height: 600px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;
const IconButton = styled(Card)`
  background: ${({ theme }) => theme.white};
  padding: 6px;
  margin: 20px;
  width: 50px;
  height: 50px;
  border-radius: 200px;
  justify-content: center;
  align-items: center;
`;

const Loader = () => {
  const theme = useTheme();
  return (
    <Container>
      <IconButton>
        <ActivityIndicator color={theme.primary} />
      </IconButton>
    </Container>
  );
};

export default Loader;
