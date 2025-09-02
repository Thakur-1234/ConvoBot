import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import Feather from "@expo/vector-icons/Feather";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Animations
  const overlayScale = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const eyeFade = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const inputFocusAnim = useRef(new Animated.Value(0)).current; // 0=blur,1=focus

  // animate overlay when typing & secure text toggle
  useEffect(() => {
    if (isTyping && secureText) {
      Animated.parallel([
        Animated.timing(overlayScale, {
          toValue: 1,
          duration: 400,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayScale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isTyping, secureText]);

  // Animate input focus shadow and border
  useEffect(() => {
    Animated.timing(inputFocusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const toggleSecureEntry = () => {
    Animated.sequence([
      Animated.timing(eyeFade, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(eyeFade, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    setSecureText((prev) => !prev);
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  // Interpolate border color and shadow for input focus
  const borderColor = inputFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ccc", "#4A90E2"],
  });
  const shadowOpacity = inputFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: inputFocusAnim,
            transform: [
              {
                translateY: inputFocusAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>Sign In</Text>
      </Animated.View>

      <Animated.View style={[styles.inputWrapper, { borderColor, shadowOpacity }]}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#999"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </Animated.View>

      <Animated.View style={[styles.inputWrapper, { borderColor, shadowOpacity, marginTop: 20 }]}>
        <TextInput
          style={[styles.input, { paddingRight: 48 }]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={secureText}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setIsTyping(text.length > 0);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setIsTyping(false);
          }}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={toggleSecureEntry}>
          <Animated.View style={{ opacity: eyeFade }}>
            <Feather name={secureText ? "eye-off" : "eye"} size={24} color="#666" />
          </Animated.View>
        </TouchableOpacity>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
              transform: [{ scale: overlayScale }],
            },
          ]}
        >
          <View style={styles.closedEye}>
            <View style={styles.closedEyeLine} />
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}
      >
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleSignIn}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity onPress={() => navigation.replace("SignUp")}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const CLOSED_EYE_LINE_WIDTH = 30;
const CLOSED_EYE_LINE_HEIGHT = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  animatedContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#f7f9fc",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0,
  },
  input: {
    padding: 12,
    fontSize: 17,
    color: "#333",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.35)",
    width: "100%",
    height: "100%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  closedEye: {
    width: 60,
    height: 40,
    borderRadius: 20,
    borderColor: "#fff",
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  closedEyeLine: {
    width: CLOSED_EYE_LINE_WIDTH,
    height: CLOSED_EYE_LINE_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 2,
    transform: [{ rotate: "45deg" }],
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 65,
    borderRadius: 12,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  signUpText: {
    marginTop: 24,
    color: "#007BFF",
    textAlign: "center",
    fontWeight: "600",
  },
});
