import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCV6ivZG65zWVCcCYzGY-mMIh7uWsCR-rA",
  authDomain: "dietapph.firebaseapp.com",
  databaseURL: "https://dietapph-default-rtdb.firebaseio.com",
  projectId: "dietapph",
  storageBucket: "dietapph.appspot.com",
  messagingSenderId: "262936847240",
  appId: "1:262936847240:web:179bad01ec6088d4e4103d",
  measurementId: "G-M88LLPF4HP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
export const db = getFirestore(app); // Firestore
export const storage = getDatabase(app);
