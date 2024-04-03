import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { FontAwesome6 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Platform, View, Text } from "react-native";
import { useTheme } from "styled-components/native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useBottomSheetContext } from "../../context/bottomSheetContext";

export default function TabsLayout() {
  const bottomSheetRef = useRef(null);
  const { openBottomSheet, setOpenBottomSheet } = useBottomSheetContext();
  const theme = useTheme();

  useEffect(() => {
    if (openBottomSheet?.open) {
      bottomSheetRef?.current.snapToIndex(0);
    }
  }, [openBottomSheet]);

  return (
    <>
      <Tabs
        initialRouteName="home"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: theme.bottomBar,
            padding: 2,
            height: 60,
          },
        }}
        tabBar={(props) =>
          Platform.OS === "ios" ? (
            // <BlurView
            //   style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
            //   intensity={95}
            // >
            //   <BottomTabBar {...props} />
            // </BlurView>
            <BottomTabBar {...props} />
          ) : (
            <BottomTabBar {...props} />
          )
        }
      >
        <Tabs.Screen
          name="home"
          options={{
            href: "/home",
            title: "",
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 14,
                  backgroundColor: "transparent",
                }}
              >
                <Ionicons
                  name="home-outline"
                  size={24}
                  style={{ marginBottom: -4 }}
                  color={color}
                />
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    opacity: 1,
                    color: color,
                  }}
                >
                  Home
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            href: "/transactions",
            title: "",
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 17,
                  backgroundColor: "transparent",
                }}
              >
                <MaterialCommunityIcons
                  name="bank-outline"
                  size={24}
                  style={{ marginBottom: -5 }}
                  color={color}
                />
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    opacity: 1,
                    color: color,
                  }}
                >
                  Transactions
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            href: "/goals",
            title: "",
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 16,
                  backgroundColor: "transparent",
                }}
              >
                <MaterialCommunityIcons
                  name="bullseye-arrow"
                  size={24}
                  color={color}
                  style={{ marginBottom: -6 }}
                />
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    opacity: 1,
                    color: color,
                  }}
                >
                  Goals
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            href: "/analytics",
            title: "",
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 16,
                  backgroundColor: "transparent",
                }}
              >
                <SimpleLineIcons
                  name="chart"
                  size={20}
                  style={{ marginBottom: -1 }}
                  color={color}
                />
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    opacity: 1,
                    color: color,
                  }}
                >
                  Analytics
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            href: "/account",
            title: "",
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 17,
                  backgroundColor: "transparent",
                }}
              >
                <FontAwesome
                  size={21}
                  style={{ marginBottom: -4 }}
                  name="user-o"
                  color={color}
                />
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    opacity: 1,
                    color: color,
                  }}
                >
                  Account
                </Text>
              </View>
            ),
          }}
        />
      </Tabs>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={
          openBottomSheet?.snapPoint ? openBottomSheet?.snapPoint : ["45%"]
        }
        enablePanDownToClose={true}
        index={-1}
        containerStyle={{
          backgroundColor: openBottomSheet.open
            ? `rgba(0,0,0,0.3)`
            : "transparent",
        }}
        onClose={() => {
          // Use callback version of setOpenBottomSheet to prevent infinite loop
          setOpenBottomSheet((prevState) => {
            if (prevState.open) {
              return {
                ...prevState,
                open: false,
                content: null,
                snapPoint: null,
              };
            }
            return prevState;
          });
        }}
      >
        <BottomSheetScrollView
          style={{
            flex: 1,
          }}
        >
          {openBottomSheet?.content}
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
}
