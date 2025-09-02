import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screens/SignInscreen";
import Chatscreen from "../screens/Chatscreen";
import SignUpScreen from "../screens/SignUpScreen";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import ChatDrawerNavigator from "./DrawerNavigator";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [user, setUser] = useState(null);   // current Firebase user (null if signed out)
  const [loading, setLoading] = useState(true); // show nothing until we know auth state

  useEffect(() => {
    // Subscribe to Firebase auth state changes (login/logout/initial load)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // save user object or null
      setLoading(false);     // auth state resolved, hide loading
    });

    // Cleanup listener on unmount to avoid memory leaks
    return () => unsubscribe();
  }, []); // run once on mount

  // While checking auth state, render nothing (or a splash if desired)
  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Conditionally define screens based on whether user is signed in
           React Navigation will switch stacks automatically when 'user' changes */}
        {!user ? (
          <>
            {/* Unauthenticated stack: Sign In / Sign Up */}
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // Authenticated stack: main app wrapped in a drawer
          <Stack.Screen
            name="ChatDrawer"
            component={ChatDrawerNavigator}
            options={{ headerShown: false }}
          />
          
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
