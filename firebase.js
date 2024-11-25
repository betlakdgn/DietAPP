import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCV6ivZG65zWVCcCYzGY-mMIh7uWsCR-rA",
    authDomain: "dietapph.firebaseapp.com",
    projectId: "dietapph",
    storageBucket: "dietapph.firebasestorage.app",
    messagingSenderId: "262936847240",
    appId: "1:262936847240:web:179bad01ec6088d4e4103d",
    measurementId: "G-M88LLPF4HP"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Eğer zaten başlatılmışsa, yeniden başlatma
}

export const signUp = async (username, password) => {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(username, password);
      return userCredential.user; // Kullanıcıyı döndürüyoruz
    } catch (error) {
      throw new Error(error.message); // Hata mesajını atıyoruz
    }
  };
