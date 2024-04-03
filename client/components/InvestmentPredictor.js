import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import styled, { css, useTheme } from "styled-components/native";
import Button from "../components/buttons/button";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import TransactionsCard from "./cards/Transactions";
import InputText from "./text_fields/inputText";
import SelectableChip from "../components/selectable/SelectableChip";
import CircularChip from "../components/selectable/CircularChip";
import { PredictInvestment } from "../api";
import { useAuthContext } from "../context/auth";

const Card = styled.View`
  flex: 1;
  flex-direction: column;
  padding: 2px 16px 16px 16px;
  gap: 12px;
`;

const Title = styled.Text`
  text-align: center;
  font-size: 20px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const Wrapper = styled.View`
  flex: 1;
  gap: 18px;
`;
const FormContainer = styled.View`
    flex: 1;
    flex-direction: column;
    padding: 16px 0px;
    gap: 20px;
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
const ResultWrapper = styled.View`
  padding: 10px 0px;
  flex-direction: column;
  flex: 1;
  border-radius: 12px;
  align-items: center;
  background: ${({ theme }) => theme.text_secondary + 10};
  margin-top: 20px;
`;
const Description = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
`;
const Suggestion = styled.Text`
  padding: 30px 0px;
  font-size: 24px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.green};
`;

const InvestmentPredictor = ({ item }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState();
    const [predictData, setPredictData] = useState({ minimum_investment: 0, potential_return: "", risk: 0, liquidity: 0, best_investment: 1})
    const [predictedData, setPredictedData] = useState("");
    const { currentUser } = useAuthContext();
    const [result, setResult] = useState(false);
    useEffect(()=>{
        if(predictedData!=="") setResult(true);
        else setResult(false);
    },[predictedData])
    const handleSubmit = async() => {
        setLoading(true)
        const response = await PredictInvestment(predictData, currentUser.token)
        setPredictedData(response.data[0])
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
            <Card>
            <Title color={item?.color}>Investment Predictor</Title>
            {result && (
                <ResultWrapper>
                    <Description>The predicted stream you should be investing on: </Description>
                    <Suggestion>{predictedData}</Suggestion>
                </ResultWrapper>
            )}
            <Wrapper>
                <FormContainer>
                    <InputText
                        startIcon={
                            <FontAwesome name="money" size={24} color={theme.text_secondary} />
                        }
                        value={predictData?.minimum_investment === 0 ? '' : predictData.minimum_investment}
                        onChangeText={(value)=>setPredictData({...predictData, minimum_investment: value})}
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
                                        value.name === predictData.potential_return
                                    }
                                    onPress={() =>
                                        setPredictData({
                                            ...predictData,
                                            potential_return: value.name,
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
            </Wrapper>
            <Button
                type="filled"
                color={theme.white}
                bgcolor={theme.primary}
                loading={loading}
                onPress={() => handleSubmit()}
                disabled={
                    predictData.minimum_investment === 0 ||
                    predictData.potential_return === "" ||
                    predictData.risk === 0 ||
                    predictData.liquidity === 0
                }
            >
                Continue
            </Button>
        </Card>
    );
};

export default InvestmentPredictor;
