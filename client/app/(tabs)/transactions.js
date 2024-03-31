import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuthContext } from "../../context/auth";

export default function Transactions() {
  const { signOut, currentUser } = useAuthContext();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Account</Text>
      <Text>{currentUser && currentUser?.user?.name}</Text>
      <TouchableOpacity onPress={() => signOut()}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
