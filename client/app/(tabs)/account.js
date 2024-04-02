import { View, Text, Switch } from "react-native";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled, { useTheme } from "styled-components/native";
import UserAvatar from "react-native-user-avatar";
import { useAuthContext } from "../../context/auth";
import { Foundation, FontAwesome5, MaterialIcons, Entypo, Feather } from '@expo/vector-icons';
import { useState } from "react";

const MainContainer = styled.ScrollView`
  flex: 1;
  padding: 70px 10px;
  background-color: ${({ theme }) => theme.bg};
`;
const Card = styled.View`
  flex-direction: column;
  border-radius: 12px;
  background: ${({ theme }) => theme.mainCard};
  flex:1;
  height: 130px;
`;
const ProfileImg = styled.View`
  width: 80px;
  height: 80px;
  margin-top: -50px;
  left: 40%;
  border: 4px solid ${({ theme }) => theme.bg};
  border-radius: 40px;
`;
const ProfileInfo = styled.View`
  padding: 20px 0px;
  flex-direction: column;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg};
  align-items: center;
  gap: 2px;
`;
const Topic = styled.Text`
  font-weight: 500;
  font-size: 12px;
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
  gap: 4px;
`;
const Finance = styled.View`
  background-color: ${({ theme }) => theme.text_secondary_light + 99};
  border-radius: 24px;
  margin: 12px;
  padding: 8px 20px;
  gap: 8px;
  flex-direction: row;
`;
const Content = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
`;
const Settings = styled.View`
  background-color: ${({ theme }) => theme.text_secondary_light + 30};
  margin: 12px 0px;
  gap: 8px;
  flex-direction: column;
  border-radius: 6px;
  padding: 12px 0px;
`;
const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 6px 10px;
  gap: 12;
`;
const HorizontalLine = styled.View`
  height: 1px;
  flex: 1;
  background-color: ${({ theme }) => theme.text_secondary_light + 70};
`;
const VerticalLine = styled.View`
  height: 36px;
  width: 2px;
  background-color: ${({ theme }) => theme.text_secondary_light + 70};
`;

export default function Account() {
  const { signOut, currentUser } = useAuthContext();
  const theme = useTheme();
  const [fingerPrint, setFingerPrint] = useState(false);

  return (
    <MainContainer>
      <Card />
      <ProfileImg>
        <UserAvatar size={80} name="Rishav Chanda" />
      </ProfileImg>
      <ProfileInfo>
        <Text style={{
          color: theme.primary,
          fontWeight: "400"
        }}>rishavchanda0@gmail.com</Text>
        <Text style={{
          fontWeight: "500",
          fontSize: 22
        }}>Rishav Chanda</Text>
        <FlexContainer>
          <Flex borderRight="1px solid #5d5d5d">
            <Foundation name="male-symbol" size={24} color={theme.primary} />
            <Text>Male</Text>
          </Flex>
          <Flex>
            <FontAwesome5 name="birthday-cake" size={18} color={theme.primary} />
            <Text>19 Nov 2003</Text>
          </Flex>
        </FlexContainer>
        <Finance>
          <Content>
            <Topic>Financial Knowledge</Topic>
            <Text style={{ fontSize: 14 }}>Moderate</Text>
          </Content>
          <VerticalLine />
          <Content>
            <Topic>Risk Tolerance</Topic>
            <Text style={{ fontSize: 14 }}>Low</Text>
          </Content>
          <VerticalLine/>
          <Content>
            <Topic>Monthly Income</Topic>
            <Text style={{ fontSize: 14 }}>Rs. 2500</Text>
          </Content>
        </Finance>
      </ProfileInfo>
      <Text style={{ color: theme.text_primary, fontSize: 20, fontWeight: 500, marginLeft: 12 }}>Settings</Text>
      <Settings>
        <Container style={{justifyContent: "space-between"}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
            <MaterialIcons name="fingerprint" size={22} color={theme.text_secondary} />
            <Text style={{fontSize: 16}}>Fingerprint Lock</Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={fingerPrint ? theme.primary : '#f4f5f2'}
            ios_backgroundColor='#85adde'
            onValueChange={()=>setFingerPrint(!fingerPrint)}
            value={fingerPrint}
            margin={0}
          />
        </Container>
        <HorizontalLine />
        <Container>
            <Entypo name="share" size={22} color={theme.text_secondary} />            
            <Text style={{fontSize: 16}}>Share</Text>
        </Container>
        <HorizontalLine />
        <Container>
            <Feather name="info" size={22} color={theme.text_secondary} />
            <Text style={{fontSize: 16}}>About Us</Text>
        </Container>
        <HorizontalLine />
        <Container>
            <MaterialIcons name="star-rate" size={22} color={theme.text_secondary} />
            <Text style={{fontSize: 16}}>Rate Us</Text>
        </Container>

      </Settings>
    </MainContainer>
  );
}
