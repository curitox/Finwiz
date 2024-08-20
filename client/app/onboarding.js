import React, { useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Image, Text, View, Animated, useWindowDimensions } from "react-native";
import { onboardingDetails } from "../utils/data";
import { PageIndicator } from "react-native-page-indicator";
import TextButton from "../components/buttons/textButton";
import { router } from "expo-router";
import { FAB } from "react-native-elements";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Container = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 52px 12px;
  background-color: ${({ theme }) => theme.bg};
`;
const Title = styled.Text`
  color: ${({ theme }) => theme.text_primary};
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 16px;
`;
const Description = styled.Text`
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 440;
  text-align: center;
`;
const Indicator = styled.View`
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
`;
const OnboardingContent = styled.View`
  width: ${({ width }) => width + "px"};
  justify-content: center;
  align-items: center;
  gap: 60px;
`;
const SkipBar = styled.View`
  width: 100%;
  padding-right: 12px;
  justify-content: flex-end;
  align-items: flex-end;
`;
const NextButton = styled.View`
  position: absolute;
  right: 0%;
`;
const Onboarding = () => {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [animatedCurrent, setAnimatedCurrent] = useState(
    useRef(Animated.divide(scrollX, width)).current
  );

  return (
    <Container>
      <SkipBar>
        <TextButton
          label="Skip"
          color={theme.primary}
          disabled={false}
          enabled={true}
          onPress={() => router.replace("/sign-up")}
        />
      </SkipBar>
      <Animated.ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: true,
          }
        )}
      >
        {onboardingDetails.map((detail, index) => (
          <OnboardingContent key={index} width={width - 20}>
            <Image
              source={{ uri: detail.image }}
              style={{ width: 300, height: 300 }}
            />
            <View>
              <Title>{detail.title}</Title>
              <Description>{detail.description}</Description>
            </View>
          </OnboardingContent>
        ))}
      </Animated.ScrollView>
      <Indicator>
        <PageIndicator
          count={onboardingDetails.length}
          current={animatedCurrent}
          color={theme.primary}
        />
        <NextButton>
          <FAB
            color={theme.primary}
            icon={{ name: "east", color: "white" }}
            onPress={() => {
              const nextIndex = Math.min(
                animatedCurrent._value + 1,
                onboardingDetails.length - 1
              );
              scrollX.setValue(nextIndex * width);
            }}
          />
        </NextButton>
      </Indicator>
    </Container>
  );
};

export default Onboarding;
