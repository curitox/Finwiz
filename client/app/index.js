import { Text, View } from "react-native";

import { useAuth } from "../context/auth";
import { Redirect } from "expo-router";

export default function Index() {
  const { signOut } = useAuth();
  return <Redirect href="/home" />;
}
