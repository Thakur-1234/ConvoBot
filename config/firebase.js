// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDyaROnloZBMj0-xMFwAQ5Kl34IlpOvnqc",
  authDomain: "aichatapp-7270c.firebaseapp.com",
  projectId: "aichatapp-7270c",
  storageBucket: "aichatapp-7270c.firebasestorage.app",
  messagingSenderId: "827112911251",
  appId: "1:827112911251:web:d60114837d38e761e13866",
  measurementId: "G-QH44WDGQYT",
};

// Ensure app is initialized only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Always initialize Auth with persistence ONCE
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore setup
const db = getFirestore(app);

export { app, auth, db };
