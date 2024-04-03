import React from 'react'
import styled, { css, useTheme } from "styled-components/native";

const StyledButton = styled.TouchableOpacity`
  ${({ flex }) => flex && `flex: 1;`}
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  height: 40px;
  width: 40px;
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
  font-size: 15px;
  font-weight: 500;

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

const CircularChip = ({
    onPress,
    color,
    selected,
    children,
    ...props
  }) => {
    const theme = useTheme();
  color = color ? color : theme.primary;
  return (
    <StyledButton
      color={color}
      onPress={onPress}
      selected={selected}
      {...props}
    >
      <ButtonText selected={selected} color={color}>
        {children}
      </ButtonText>
    </StyledButton>
  )
}

export default CircularChip