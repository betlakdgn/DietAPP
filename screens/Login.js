import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconFrame from '../components/IconFrame'; // Doğru yolu kontrol edin
import ButtonComponent from '../components/ButtonComponent'; // Doğru yolu kontrol edin
import TextInputComponent from '../components/Input'; // TextInput bileşenini dahil ettik
import ForgotPassword from '../components/ForgotPassword';
import BackButton from '../components/BackButton';
import {auth} from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { validateEmail, validatePassword} from '../utils/validation';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Hata", "Lütfen e-posta adresinizi girin.");
      return;
    }
  
    try {
      await sendPasswordResetEmail(auth,(email));
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
      Alert.alert("Hata", "Giriş sırasında bir hata oluştu.");
    }
  };
  return (
    <View style={styles.container}>
      
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

      {/* Şifremi Unuttum */}
      <ForgotPassword onPress={handleForgotPassword} />

      {/* Giriş Butonu */}
      <ButtonComponent title="Giriş Yap" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
});

export default Login;
