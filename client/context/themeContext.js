import React, { createContext, useContext, useState, useEffect } from "react";
import { light, dark } from "../utils/colors";
import { ThemeProvider as StyledThemeProvider } from "styled-components/native";
import * as SecureStore from "expo-secure-store";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Default theme is light

  useEffect(() => {
    async function loadTheme() {
      const storedTheme = await getTheme();
      if (storedTheme) {
        setTheme(storedTheme);
      }
    }
    loadTheme();
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const currentTheme = theme === "light" ? light : dark;
  // const currentTheme = dark;

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, currentTheme }}>
      <StyledThemeProvider theme={currentTheme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

async function saveTheme(theme) {
  try {
    await SecureStore.setItemAsync("theme", theme);
  } catch (error) {
    console.error("Error saving theme:", error);
  }
}

async function getTheme() {
  try {
    const storedTheme = await SecureStore.getItemAsync("theme");
    return storedTheme || "light"; // Return light theme if no theme is stored
  } catch (error) {
    console.error("Error getting theme:", error);
    return "light"; // Return light theme if there's an error
  }
}
