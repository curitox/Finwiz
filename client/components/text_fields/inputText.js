import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import styled, { useTheme } from "styled-components/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-width: 1.2px;
  border-color: ${({ error, focused, theme }) =>
    error ? "red" : focused ? theme.primary + 80 : theme.text_secondary_light};
  border-radius: 10px;
  padding-horizontal: 14px;
  padding-vertical: 6px;
  gap: 12px;
  ${({ small }) =>
    small &&
    `
  gap: 8px;
  padding-horizontal: 12px;
  padding-vertical: 4px;`}
`;

const Hr = styled.View`
  height: 80%;
  width: 1.2px;
  background-color: ${({ theme }) => theme.text_secondary_light};
`;

const InputWrapper = styled.View`
  flex: 1;
`;

const InputField = styled.TextInput`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  padding-bottom: 6px;
  ${({ small }) =>
    small &&
    `
  font-size: 12px;
  padding-bottom: 4px;`}
`;

const Label = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: ${({ error, focused, theme }) =>
    error ? "red" : focused ? theme.primary : theme.text_secondary};
  ${({ small }) =>
    small &&
    `
  font-size: 10px;`}
`;

const ErrorText = styled.Text`
  color: red;
  font-size: 10px;
`;

const IconContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const ToggleButton = styled.TouchableOpacity`
  padding: 4px;
`;

const InputText = ({
  startIcon,
  endIcon,
  label,
  value,
  name,
  onChangeText,
  error,
  secureTextEntry,
  type,
  custom,
  small,
  ...props
}) => {
  const theme = useTheme();
  const [isPasswordVisible, setPasswordVisible] = useState(!secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <View>
      <InputContainer focused={isFocused} error={error} small={small}>
        {startIcon && <IconContainer>{startIcon}</IconContainer>}
        <Hr error={error} />
        <InputWrapper small={small}>
          <Label error={error} focused={isFocused} small={small}>
            {label}
          </Label>
          {custom ? (
            { custom }
          ) : (
            <InputField
              value={value}
              name={name}
              onChangeText={(text) => onChangeText(text, name)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              secureTextEntry={secureTextEntry && !isPasswordVisible}
              placeholderTextColor={"#777"}
              keyboardType={type}
              small={small}
              {...props}
            />
          )}
        </InputWrapper>
        {endIcon && <IconContainer>{endIcon}</IconContainer>}
        {secureTextEntry && (
          <ToggleButton onPress={togglePasswordVisibility}>
            <Icon
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={22}
              color={theme.text_secondary}
            />
          </ToggleButton>
        )}
      </InputContainer>

      {error && <ErrorText>{error}</ErrorText>}
    </View>
  );
};

export default InputText;
