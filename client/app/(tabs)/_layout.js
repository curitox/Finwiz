import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { FontAwesome6 } from "@expo/vector-icons";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarStyle: Platform.OS === "ios" && {
          backgroundColor: "transparent",
        },
        headerShown: false,
      }}
      tabBar={(props) =>
        Platform.OS === "ios" ? (
          <BlurView
            style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
            intensity={95}
          >
            <BottomTabBar {...props} />
          </BlurView>
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
                marginTop: 17,
                backgroundColor: "transparent",
              }}
            >
              <FontAwesome
                size={26}
                style={{ marginBottom: -6 }}
                name="home"
                color={color}
              />
              <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.6 }}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="expences"
        options={{
          href: "/expences",
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
                name="bank"
                size={20}
                style={{ marginBottom: 0 }}
                color={color}
              />
              <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.6 }}>
                Expences
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
                size={27}
                color={color}
                style={{ marginBottom: -6 }}
              />
              <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.6 }}>
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
              <FontAwesome
                size={22}
                style={{ marginBottom: -2 }}
                name="pie-chart"
                color={color}
              />
              <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.6 }}>
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
                size={24}
                style={{ marginBottom: -5 }}
                name="user"
                color={color}
              />
              <Text style={{ marginTop: 5, fontSize: 10, opacity: 0.6 }}>
                Account
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
