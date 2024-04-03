import { View, Text, Pressable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuthContext } from "../../context/auth";
import { Ionicons } from "@expo/vector-icons";
import styled, { useTheme } from "styled-components/native";
import { useRouter } from "expo-router";
import InputText from "../../components/text_fields/inputText";
import { FontAwesome } from '@expo/vector-icons';
import { useState } from "react";
import SelectableChip from "../../components/selectable/SelectableChip";
import CircularChip from "../../components/selectable/CircularChip";
import Button from "../../components/buttons/button";

const MainContainer = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.bg};
    padding: 42px 16px 16px 16px;
    gap: 22px;
`;
const Back = styled.TouchableOpacity`
  width: 46px;
  height: 46px;
  border-radius: 46px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.text_secondary + 20};
`;
const FormContainer = styled.View`
    flex: 1;
    flex-direction: column;
    padding: 16px 0px;
    gap: 20px;
`;
const Title = styled.Text`
  text-align: center;
  font-weight: 600;
  font-size: 24px;
  color: ${({ theme }) => theme.text_primary};
`;
const Wrapper = styled.View`
  flex: 1;
  justify-content: space-between;
  padding: 18px 0px 8px 0px;
  gap: 22px;
`;
const SelectableItem = styled.View`
  flex-direction: column;
  padding: 4px 4px;
  gap: 8px;
`;
const InputName = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;

export default function Investment() {
  const router = useRouter();
  const { signOut, currentUser } = useAuthContext();
  const [loading, setLoading] = useState();
  const theme = useTheme();
  const [predictData, setPredictData] = useState({ minInvestment: 0, potentialRet: "", risk: 0, })
  const handleInputChange = (value, name) => {
    setPredictData({ ...predictData, [name]: value });
  };
  const handleSubmit = () => {
    setLoading(true)
    setLoading(false)
  }
  const potentialReturn = [
    {
      name: "High",
      value: "🤑 High"
    },
    {
      name: "Average",
      value: "💼 Average"
    },
    {
      name: "Low",
      value: "📈 Low"
    }
  ]
  const range = [1, 2, 3, 4, 5]

  return (
    <MainContainer>
      <Back onPress={() => router.replace("/home")}>
        <Ionicons
          name="chevron-back"
          size={22}
          color={theme.text_primary}
        />
      </Back>
      <Title>Investment Predictor</Title>
      <Wrapper>
        <FormContainer>
            <InputText
              startIcon={
                <FontAwesome name="money" size={24} color={theme.text_secondary} />
              }
              value={predictData.minInvestment === 0 ? '' : predictData.minInvestment}
              onChangeText={handleInputChange}
              placeholder="Enter an amount"
              label="Minimum Investment"
              name="Minimum Investment"
              type={"numeric"}
            />
            <SelectableItem>
              <InputName>Potential Return</InputName>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {potentialReturn.map((value, index) => (
                  <SelectableChip
                    flex
                    key={index}
                    selected={
                      value.name === predictData.potentialRet
                    }
                    onPress={() =>
                      setPredictData({
                        ...predictData,
                        return: value.name,
                      })
                    }
                    startIcon={value.icon}
                    color={theme.primary}
                  >
                    {value.value}
                  </SelectableChip>
                ))}
              </View>
            </SelectableItem>
            <SelectableItem>
              <InputName>Risk</InputName>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 20,
                }}
              >
                {range.map((r, index) => (
                  <CircularChip
                    key={index}
                    selected={
                      r === predictData.risk
                    }
                    onPress={() =>
                      setPredictData({
                        ...predictData,
                        risk: r,
                      })
                    }
                    color={theme.primary}
                  >
                    {r}
                  </CircularChip>
                ))}
              </View>
            </SelectableItem>
            <SelectableItem>
              <InputName>Liquidity</InputName>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 20,
                }}
              >
                {range.map((l, index) => (
                  <CircularChip
                    key={index}
                    selected={
                      l === predictData.liquidity
                    }
                    onPress={() =>
                      setPredictData({
                        ...predictData,
                        liquidity: l,
                      })
                    }
                    color={theme.primary}
                  >
                    {l}
                  </CircularChip>
                ))}
              </View>
            </SelectableItem>
        </FormContainer>
        <Button
          type="filled"
          color={theme.white}
          bgcolor={theme.primary}
          loading={loading}
          onPress={() => handleSubmit()}
          disabled={
            predictData.minInvestment === 0 ||
            predictData.potentialRet === "" ||
            predictData.risk === 0 ||
            predictData.liquidity === 0
          }
        >
          Continue
        </Button>
      </Wrapper>
    </MainContainer>
  );
}
