import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  Text,
  ImageBackground,
} from "react-native";
import styled, { css, useTheme } from "styled-components/native";
import UserAvatar from "react-native-user-avatar";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  gap: 6px;
`;

const Wrapper = styled.View`
  flex: 1;
  padding: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const IconButton = styled.TouchableOpacity`
  background: ${({ theme }) => theme.text_secondary + 20};
  padding: 6px;
  width: 40px;
  height: 40px;
  border-radius: 200px;
  justify-content: center;
  align-items: center;
`;

const Topbar = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Container>
      <Wrapper>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
          }}
        >
          <TouchableOpacity
            style={{
              width: 40,
            }}
            onPress={() => router.replace("/account")}
          >
            <UserAvatar size={40} name="Rishav Chanda" />
          </TouchableOpacity>
          {/* <Text>FinWiz</Text> */}
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 16,
          }}
        >
          <IconButton onPress={() => router.replace("/scan-code")}>
            <MaterialCommunityIcons
              name="qrcode-scan"
              color={theme.text_primary}
              size={18}
            />
          </IconButton>
          <IconButton>
            <FontAwesome name="bell-o" color={theme.text_primary} size={18} />
          </IconButton>
        </View>
      </Wrapper>
    </Container>
  );
};

export default Topbar;
