import React from "react";
import { TouchableOpacity, ActivityIndicator, View, Text } from "react-native";
import styled, { css, useTheme } from "styled-components/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const StyledButton = styled.TouchableOpacity`
  ${({ flex }) => flex && `flex: 1;`}
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding-vertical: 4px;
  padding-horizontal: 8px;
  gap: 6px;
  color: ${({theme}) => theme.text_secondary + 90};

  ${({ color, theme, selected }) => {
    if (selected) {
      return css`
        border-width: 1.2px;
        border-color: ${color};
        color: ${color};
        background-color: ${color + 20};
      `;
    } else {
      return css`
        border-width: 1.2px;
        border-color: ${theme.text_secondary + 90};
        color: ${theme.text_secondary + 90};
      `;
    }
  }}
`;

const ButtonText = styled.Text`
  font-size: 13px;
  font-weight: 500;
  line-height: 24px;

  ${({ color, theme, selected }) => {
    if (selected) {
      return css`
        color: ${color};
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
  flex,
  startIcon,
  startIconText,
  endIcon,
  onPress,
  color,
  children,
  selected,
  ...props
}) => {
  const theme = useTheme();
  color = color ? color : theme.primary;
  return (
    <StyledButton
      color={color}
      flex={flex}
      onPress={onPress}
      selected={selected}
      {...props}
    >
      {startIcon}
      {startIconText && (
        <IconContainer>
          <FontAwesome
            name={startIconText}
            size={15}
            color={selected ? theme.primary : theme.text_primary}
          />
        </IconContainer>
      )}
      <ButtonText selected={selected} color={color}>
        {children}
      </ButtonText>
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
