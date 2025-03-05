import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconFrame from '../components/IconFrame'; 
import ButtonComponent from '../components/ButtonComponent'; 
import TextInputComponent from '../components/Input'; 
import ForgotPassword from '../components/ForgotPassword';
import BackButton from '../components/BackButton';
import {auth} from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { validateEmail, validatePassword} from '../utils/validation';
import { ImageBackground } from 'react-native';
import background from '../assets/backgroun.jpg';

const Login = () => {
  const navigation =useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Hata", "Lütfen e-posta adresinizi girin.");
      return;
    }
  
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Başarılı", "Şifre sıfırlama e-postası gönderildi.");
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Hata", "Geçerli bir e-posta adresi girin.");
      return;
    }
  
    if (!validatePassword(password)) {
      Alert.alert("Hata", "Şifre en az 6 karakter uzunluğunda olmalıdır.");
      return;
    }
    setErrorMessage('');
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await AsyncStorage.setItem('userToken', user.uid);
      navigation.navigate('Profile');
    } catch (error) {
      if (error.code === 'auth/wrong-password') {//bu kısım çalışmıyor
        Alert.alert(
          "Hata",
          "Şifre hatalı. Şifrenizi mi unuttunuz?",
          [
            { text: "İptal", style: "cancel" },
            { text: "Şifre Sıfırla", onPress: handleForgotPassword }
          ]
        );
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert("Hata", "Kullanıcı bulunamadı. Lütfen kayıt olun.");
      } else {
        Alert.alert("Hata", "Giriş sırasında bir hata oluştu.");
      }
    }
  };
  return (
    <ImageBackground source={background} style ={styles.backgroundcontainer}>
      <View style={styles.overlay}></View>
        <BackButton targetScreen="MainLoginPage" />

        
        <IconFrame imageSource={require('../assets/myIcon.png')} />

        
        <TextInputComponent
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
        />

        
        <TextInputComponent
          placeholder="Şifre"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        {errorMessage !== '' && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}

        
        <ForgotPassword onPress={handleForgotPassword} />

        
        <ButtonComponent title="Giriş Yap" onPress={handleLogin} />
      
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Bu stil ile tam ekran kapsar
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Saydamlık için rgba kullanıyoruz (0.3 saydamlık)
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
});

export default Login;
