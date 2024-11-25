import React, { useState } from 'react';
import { View, Alert, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconFrame from '../components/IconFrame'; // Doğru yolu kontrol edin
import ButtonComponent from '../components/ButtonComponent'; // Doğru yolu kontrol edin
import TextInputComponent from '../components/Input'; // TextInput bileşenini dahil ettik
import ForgotPassword from '../components/ForgotPassword';
import BackButton from '../components/BackButton';
import firebase from 'firebase/compat/app';

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
      await firebase.auth().signInWithEmailAndPassword(username, password);
      navigation.navigate('Profile'); // Başarılı giriş sonrası Profile ekranına yönlendirme
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
  title: {
    fontSize: 24,
    margin: 20,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  }
});

export default Login;
