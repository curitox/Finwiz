import React from "react";
import { TouchableOpacity, ActivityIndicator, View, Text } from "react-native";
import styled, { css, useTheme } from "styled-components/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const StyledButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding-vertical: 4px;
  padding-horizontal: 6px;
  gap: 4px;

  ${({ theme, selected }) => {
    if (selected) {
      return css`
        border-width: 1.2px;
        border-color: ${theme.primary};
        color: ${theme.primary};
        background-color: ${theme.primary + 20};
      `;
    } else {
      return css`
        border-width: 1.2px;
        border-color: ${theme.text_primary + 90};
        color: ${theme.text_primary + 90};
      `;
    }
  }}
`;

const ButtonText = styled.Text`
  font-size: 13px;
  font-weight: 500;
  line-height: 24px;

  ${({ theme, selected }) => {
    if (selected) {
      return css`
        color: ${theme.primary};
      `;
    } else {
      return css`
        color: ${theme.text_primary + 90};
      `;
    }
  }}
`;

const IconContainer = styled.View`
  padding: 0px 6px;
`;

const SelectableChip = ({
  startIcon,
  endIcon,
  onPress,
  children,
  selected,
  ...props
}) => {
  const theme = useTheme();
  return (
    <StyledButton onPress={onPress} selected={selected} {...props}>
      {startIcon && (
        <IconContainer>
          <FontAwesome
            name={startIcon}
            size={15}
            color={selected ? theme.primary : theme.text_primary}
          />
        </IconContainer>
      )}
      <ButtonText selected={selected}>{children}</ButtonText>
      {endIcon && (
        <IconContainer>
          <FontAwesome
            name={endIcon}
            size={15}
            color={selected ? theme.primary : theme.text_primary}
          />
        </IconContainer>
      )}
    </StyledButton>
  );
};

export default SelectableChip;
