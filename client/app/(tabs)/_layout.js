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
import BottomSheet, {
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useBottomSheetContext } from "../../context/bottomSheetContext";

export default function TabsLayout() {
  const bottomSheetRef = useRef(null);
  const { openBottomSheet, setOpenBottomSheet } = useBottomSheetContext();
  const theme = useTheme();

  useEffect(() => {
    if (openBottomSheet?.open) {
      bottomSheetRef?.current.snapToIndex(0);
    } else if (openBottomSheet?.open === false) {
      bottomSheetRef?.current.close();
    }
  }, [openBottomSheet]);

  return (
    <>
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 0,
            position: "absolute",
            backgroundColor: theme.bottomBar,
            padding: 2,
            height: Platform.OS === "ios" ? 100 : 60,
          },
          tabBarLabelStyle: {
            color: theme.text_primary,
            fontWeight: "bold",
          },
        }}
        tabBar={(props) =>
          Platform.OS === "ios" ? (
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
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 14,
                  backgroundColor: "transparent",
                }}
              >
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={24}
                  style={{ marginBottom: -4 }}
                  color={focused ? theme.primary : theme.text_secondary}
                />
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    opacity: 1,
                    fontWeight: 500,
                    color: focused ? theme.primary : theme.text_secondary,
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
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 17,
                  backgroundColor: "transparent",
                }}
              >
                <MaterialCommunityIcons
                  name={focused ? "bank" : "bank-outline"}
                  size={24}
                  style={{ marginBottom: -5 }}
                  color={focused ? theme.primary : theme.text_secondary}
                />
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    opacity: 1,
                    fontWeight: 500,
                    color: focused ? theme.primary : theme.text_secondary,
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
            tabBarIcon: ({ color, focused }) => (
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
                  color={focused ? theme.primary : theme.text_secondary}
                  style={{ marginBottom: -6 }}
                />
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    opacity: 1,
                    fontWeight: 500,
                    color: focused ? theme.primary : theme.text_secondary,
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
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 16,
                  backgroundColor: "transparent",
                }}
              >
                <Ionicons
                  name={focused ? "stats-chart" : "stats-chart-outline"}
                  size={24}
                  style={{ marginBottom: -1 }}
                  color={focused ? theme.primary : theme.text_secondary}
                />
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    opacity: 1,
                    fontWeight: 500,
                    color: focused ? theme.primary : theme.text_secondary,
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
            tabBarIcon: ({ color, focused }) => (
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
                  style={{ marginBottom: -1 }}
                  name={focused ? "user" : "user-o"}
                  color={focused ? theme.primary : theme.text_secondary}
                />
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    opacity: 1,
                    fontWeight: 500,
                    color: focused ? theme.primary : theme.text_secondary,
                  }}
                >
                  Account
                </Text>
              </View>
            ),
          }}
        />
      </Tabs>

      <BottomSheetModalProvider>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={
            openBottomSheet?.snapPoint ? openBottomSheet?.snapPoint : ["45%"]
          }
          enablePanDownToClose={true}
          index={-1}
          backgroundStyle={{ backgroundColor: theme.card }}
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
      </BottomSheetModalProvider>
    </>
  );
}
