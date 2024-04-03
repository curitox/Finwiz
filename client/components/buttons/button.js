import React from "react";
import { TouchableOpacity, ActivityIndicator, View, Text } from "react-native";
import styled, { css } from "styled-components/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const StyledButton = styled.TouchableOpacity`
  flex: 1;
  max-height: 58px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding-vertical: 16px;
  padding-horizontal: 18px;
  gap: 10px;
  ${({ small }) => small && `padding-vertical: 8px`};
  ${({ small }) =>
    small &&
    `padding-horizontal: 14px;
  border-radius: 10px;`};
  ${({ micro }) => micro && `padding-vertical: 4px`};
  ${({ micro }) =>
    micro &&
    `padding-horizontal: 12px;
  border-radius: 8px;
  gap: 6px;`};

  ${({ type, bgcolor, bordercolor }) => {
    if (type === "outlined") {
      return css`
        border-width: 1.2px;
        border-color: ${bordercolor};
        background-color: transparent;
      `;
    } else {
      return css`
        background-color: ${bgcolor};
      `;
    }
  }}

  ${({ disabled, theme }) =>
    disabled &&
    css`
      opacity: 0.6;
    `}
`;

const ButtonText = styled.Text`
  font-size: 14px;
  ${({ small }) => small && `font-size: 12px`};
  ${({ micro }) => micro && `font-size: 10px`};
  font-weight: 600;
  line-height: 24px;
  color: ${({ color }) => color};
`;

const LoadingIndicator = styled(ActivityIndicator)`
  ${({ color }) => css`
    color: ${color};
  `}
`;

const ButtonIcon = styled(Icon)``;

const Button = ({
  startIcon,
  endIcon,
  type = "filled",
  disabled = false,
  bgcolor = "#7F265B",
  color = "white",
  bordercolor = "#000",
  onPress,
  children,
  loading = false,
  small,
  micro,
  ...props
}) => {
  return (
    <StyledButton
      bgcolor={bgcolor}
      bordercolor={bordercolor}
      color={color}
      type={type}
      disabled={disabled || loading} // Disable the button when loading is true
      onPress={onPress}
      small={small}
      micro={micro}
      {...props}
    >
      {loading && <LoadingIndicator size="small" color={color} />}
      {startIcon && startIcon}
      <ButtonText type={type} color={color} small={small} micro={micro}>
        {children}
      </ButtonText>
      {endIcon && endIcon}
    </StyledButton>
  );
};

export default Button;
