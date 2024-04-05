import React, { useContext, useEffect, useRef } from "react";
import { useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Slot, Stack } from "expo-router";
import { ThemeProvider } from "../context/themeContext";
import { Provider } from "../context/auth";
import { BottomSheetProvider } from "../context/bottomSheetContext";

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
        <BottomSheetProvider>
          <Stack onLayout={onLayoutRootView}>
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
              name="scan-code"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </BottomSheetProvider>
      </Provider>
    </ThemeProvider>
  );
};

export default Layout;
