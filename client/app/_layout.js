import React from "react";
import { useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Slot, Stack } from "expo-router";
import { ThemeProvider } from "../context/themeContext";
import { Provider } from "../context/auth";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  // return <Stack onLayout={onLayoutRootView} />;

  return (
    <ThemeProvider>
      <Provider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(quicklinks)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="other"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </Provider>
    </ThemeProvider>
  );
};

export default Layout;
