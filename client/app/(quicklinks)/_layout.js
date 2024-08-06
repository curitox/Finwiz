import React from "react";
import * as SplashScreen from "expo-splash-screen";
import { Stack, useRouter } from "expo-router";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default Layout;
