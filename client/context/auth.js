import { router, useSegments } from "expo-router";
import React from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = React.createContext(null);

// This hook can be used to access the currentUser info.
export function useAuthContext() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on currentUser authentication.
function useProtectedRoute(currentUser) {
  const segments = useSegments();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!currentUser && !currentUser?.user?.profileCreated && !inAuthGroup) {
      router.replace("/sign-in");
    } else if (
      currentUser &&
      inAuthGroup &&
      currentUser?.user?.profileCreated
    ) {
      router.replace("/");
    }
  }, [currentUser, segments]);
}

async function saveUser(user) {
  try {
    await SecureStore.setItemAsync("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user:", error);
  }
}

async function getUser() {
  try {
    const user = await SecureStore.getItemAsync("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export function Provider(props) {
  const [currentUser, setAuth] = React.useState(null);

  React.useEffect(() => {
    async function loadUser() {
      const user = await getUser();
      if (user) {
        setAuth(user);
      }
    }
    loadUser();
  }, []);

  useProtectedRoute(currentUser);

  const signIn = async (user) => {
    setAuth(user);
    await saveUser(user);
  };

  const signOut = async () => {
    setAuth(null);
    await SecureStore.deleteItemAsync("user");
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        currentUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
