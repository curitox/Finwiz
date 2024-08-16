import { View, Text, Switch, StatusBar } from "react-native";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled, { useTheme } from "styled-components/native";
import UserAvatar from "react-native-user-avatar";
import { useAuthContext } from "../../context/auth";
import {
  Foundation,
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import { useState } from "react";
import BgImage from "../../assets/icons/pattern.png";
import { useThemeContext } from "../../context/themeContext";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { useBottomSheetContext } from "../../context/bottomSheetContext";
import ProfileUpdate from "../../components/profileUpdate";

const MainContainer = styled.ScrollView`
  background-color: ${({ theme }) => theme.bg};
`;
const Card = styled.View`
  flex-direction: column;
  border-radius: 16px;
  background: ${({ theme }) => theme.mainCard};
  flex: 1;
  height: 150px;
  overflow: hidden;
`;

const ImageBg = styled.ImageBackground`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.5;
`;

const ProfileImg = styled.View`
  width: 100px;
  height: 100px;
  margin-top: -50px;
  left: 38%;
  border: 4px solid ${({ theme }) => theme.bg};
  border-radius: 100px;
`;
const ProfileInfo = styled.View`
  padding: 16px 0px;
  flex-direction: column;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg};
  align-items: center;
  gap: 2px;
`;
const Topic = styled.Text`
  font-weight: 500;
  font-size: 10px;
  color: ${({ theme }) => theme.text_secondary};
`;
const FlexContainer = styled.View`
  flex-direction: row;
  gap: 30px;
  padding: 10px 0px;
  align-items: center;
`;
const Flex = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
const Finance = styled.View`
  background-color: ${({ theme }) => theme.text_secondary_light + 10};
  border-radius: 12px;
  margin: 12px;
  padding: 10px 20px;
  gap: 16px;
  flex-direction: row;
`;
const Content = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
`;
const Settings = styled.View`
  background-color: ${({ theme }) => theme.text_secondary_light + 10};
  margin: 12px 0px;
  gap: 8px;
  flex-direction: column;
  border-radius: 6px;
  padding: 12px 10px;
`;
const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 6px 10px;
  gap: 12px;
`;
const HorizontalLine = styled.View`
  height: 1px;
  flex: 1;
  background-color: ${({ theme }) => theme.text_secondary_light + 10};
`;
const VerticalLine = styled.View`
  height: 36px;
  width: 2px;
  background-color: ${({ theme }) => theme.text_secondary_light + 70};
`;

const TextColor = styled.Text`
  color: ${({ theme }) => theme.text_secondary};
`;

export default function Account() {
  const { setOpenBottomSheet } = useBottomSheetContext();
  const { signOut, currentUser } = useAuthContext();
  const { appTheme, toggleTheme } = useThemeContext();
  const theme = useTheme();
  const [fingerPrint, setFingerPrint] = useState(false);

  return (
    <MainContainer>
      <StatusBar
        barStyle={"light"}
        backgroundColor={"transparent"} // Set the status bar color based on the theme
      />
      <Card>
        <ImageBg source={BgImage} resizeMode="cover" />
      </Card>
      <ProfileImg>
        <UserAvatar size={100} name={currentUser?.user?.name} />
      </ProfileImg>
      <ProfileInfo>
        <Text
          style={{
            fontWeight: "500",
            fontSize: 22,
            color: theme.text_primary,
          }}
        >
          {currentUser?.user?.name}
        </Text>
        <Text
          style={{
            color: theme.primary,
            fontWeight: "400",
          }}
        >
          {currentUser?.user?.email}
        </Text>
        <FlexContainer>
          <Flex borderRight="1px solid #5d5d5d">
            <Foundation name="male-symbol" size={24} color={theme.primary} />
            <Text style={{ color: theme.text_secondary }}>
              {currentUser?.user?.gender}
            </Text>
          </Flex>
          <Flex>
            <FontAwesome5
              name="birthday-cake"
              size={16}
              color={theme.primary}
            />
            <Text style={{ color: theme.text_secondary }}>
              {moment(currentUser?.user?.dob).format("MMMM Do YYYY")}
            </Text>
          </Flex>
        </FlexContainer>
        <Finance>
          <Content>
            <Topic>Financial Knowledge</Topic>
            <Text
              style={{
                fontSize: 13,
                color: theme.text_primary,
                fontWeight: 500,
              }}
            >
              {currentUser?.user?.financialKnowledge}
            </Text>
          </Content>
          <VerticalLine />
          <Content>
            <Topic>Risk Tolerance</Topic>
            <Text
              style={{
                fontSize: 13,
                color: theme.text_primary,
                fontWeight: 500,
              }}
            >
              {currentUser?.user?.riskTolerance}
            </Text>
          </Content>
          <VerticalLine />
          <Content>
            <Topic>Monthly Income</Topic>
            <Text
              style={{
                fontSize: 13,
                color: theme.text_primary,
                fontWeight: 500,
              }}
            >
              ₹{currentUser?.user?.monthlyIncome}
            </Text>
          </Content>
        </Finance>
      </ProfileInfo>
      <Text
        style={{
          color: theme.text_primary,
          fontSize: 20,
          fontWeight: 500,
          marginLeft: 12,
        }}
      >
        Settings
      </Text>
      <Settings>
        <Container style={{ justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <MaterialIcons
              name="fingerprint"
              size={22}
              color={theme.text_secondary}
            />
            <TextColor style={{ fontSize: 16 }}>Fingerprint Lock</TextColor>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={fingerPrint ? theme.primary : "#f4f5f2"}
            ios_backgroundColor="#85adde"
            onValueChange={() => setFingerPrint(!fingerPrint)}
            value={fingerPrint}
            style={{
              transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
              height: 12,
            }}
          />
        </Container>
        <HorizontalLine />
        <Container
          style={{ justifyContent: "space-between" }}
          onPress={() => toggleTheme()}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            {appTheme === "light" ? (
              <MaterialIcons
                name="nightlight-round"
                size={22}
                color={theme.text_secondary}
              />
            ) : (
              <MaterialCommunityIcons
                name="lightbulb-on"
                size={22}
                color={theme.text_secondary}
              />
            )}
            <TextColor style={{ fontSize: 16 }}>
              {appTheme === "light" ? "Dark Mode" : "Light Mode"}
            </TextColor>
          </View>
        </Container>
        <HorizontalLine />
        <Container
          onPress={() =>
            setOpenBottomSheet({
              open: true,
              content: <ProfileUpdate />,
              snapPoint: ["70%, 80%"],
            })
          }
        >
          <MaterialIcons name="update" size={22} color={theme.text_secondary} />
          <TextColor style={{ fontSize: 16 }}>Update Profile</TextColor>
        </Container>
        <HorizontalLine />
        <Container>
          <Entypo name="share" size={22} color={theme.text_secondary} />
          <TextColor style={{ fontSize: 16 }}>Share</TextColor>
        </Container>
        <HorizontalLine />
        <Container>
          <Feather name="info" size={22} color={theme.text_secondary} />
          <TextColor style={{ fontSize: 16 }}>About Us</TextColor>
        </Container>
        <HorizontalLine />
        <Container>
          <MaterialIcons
            name="star-rate"
            size={22}
            color={theme.text_secondary}
          />
          <TextColor style={{ fontSize: 16 }}>Rate Us</TextColor>
        </Container>
        <HorizontalLine />
        <Container onPress={() => signOut()}>
          <AntDesign name="logout" size={20} color={theme.categoryRed + 90} />
          <TextColor style={{ fontSize: 16, color: theme.categoryRed + 90 }}>
            Logout
          </TextColor>
        </Container>
      </Settings>
      <View style={{ height: 120 }}></View>
    </MainContainer>
  );
}
