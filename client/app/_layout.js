import React, { useContext, useEffect, useRef } from "react";
import { useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Slot, Stack,Text } from "expo-router";
import { ThemeProvider } from "../context/themeContext";
import { Provider } from "../context/auth";
import { BottomSheetProvider } from "../context/bottomSheetContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const [loaded] = useFonts({
    DMBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <Provider>
        <GestureHandlerRootView>
          <BottomSheetProvider>
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
                name="scan-code"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="onboarding"
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
        </GestureHandlerRootView>
      </Provider>
    </ThemeProvider>
  );
};

export default Layout;
