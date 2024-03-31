import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styled, { css } from "styled-components/native";

const TextButtonContainer = styled(TouchableOpacity)`
  background-color: transparent;
`;

const TextButtonLabel = styled.Text`
  color: ${({ color }) => color || "white"};
  font-size: ${({ small }) => (small ? `12px` : "14px")};
  font-weight: 500;
`;

const TextButton = ({ small, onPress, label, color, disabled, enabled }) => {
  const isDisabled = enabled === false || disabled;

  return (
    <TextButtonContainer
      onPress={isDisabled ? null : onPress}
      disabled={isDisabled}
    >
      <TextButtonLabel color={color} disabled={isDisabled} small={small}>
        {label}
      </TextButtonLabel>
    </TextButtonContainer>
  );
};

export default TextButton;
