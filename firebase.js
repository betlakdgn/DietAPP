import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBcD1jakoVKbOLSxOlVeyEc1535nFB8cjc",
  authDomain: "dietapph.firebaseapp.com",
  databaseURL: "https://dietapph-default-rtdb.firebaseio.com",
  projectId: "dietapph",
  storageBucket: "dietapph.firebasestorage.app",
  messagingSenderId: "262936847240",
  appId: "1:262936847240:web:179bad01ec6088d4e4103d",
  measurementId: "G-M88LLPF4HP"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

// Offline persistence devre dışı bırakılıyor, cache ayarı yapılmıyor
// const db = getFirestore(app);  // Firestore'u sadece çevrimiçi kullanıyoruz.

export { auth };
export { db };
export const storage = getDatabase(app);
