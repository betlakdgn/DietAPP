import React, { useState } from 'react';
import { View, Alert, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconFrame from '../components/IconFrame'; // Doğru yolu kontrol edin
import ButtonComponent from '../components/ButtonComponent'; // Doğru yolu kontrol edin
import TextInputComponent from '../components/Input'; // TextInput bileşenini dahil ettik
import ForgotPassword from '../components/ForgotPassword';
import BackButton from '../components/BackButton';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleForgotPassword = () => {
    Alert.alert("Şifremi Unuttum", "Şifre sıfırlama linki e-posta adresinize gönderildi.");
  };

  const handleLogin = async () => {
    try {
      // Firebase ile giriş yapma
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(username, password);

      // Giriş başarılı, kullanıcı bilgilerini kaydet
      const user = userCredential.user;
      await AsyncStorage.setItem('userToken', user.uid);

      // Profile ekranına yönlendir
      navigation.navigate('Profile');
    } catch (error) {
      // Hata durumunda errorMessage state'ini güncelle
      if (error.code === 'auth/invalid-email') {
        setErrorMessage('Geçersiz e-posta adresi!');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Yanlış şifre!');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('Kullanıcı bulunamadı!');
      } else {
        setErrorMessage('Giriş yaparken bir hata oluştu.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Geri butonu */}
      <BackButton targetScreen="MainLoginPage" />

      {/* Üstte ortalanmış ikon */}
      <IconFrame imageSource={require('../assets/myIcon.png')} />

      {/* Kullanıcı Adı Giriş Alanı */}
      <TextInputComponent
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={setUsername}
      />

      {/* Şifre Giriş Alanı */}
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
