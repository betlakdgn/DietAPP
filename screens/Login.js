import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IconFrame from './components/IconFrame'; // Doğru yolu kontrol edin
import ButtonComponent from './components/LogButtons'; // Doğru yolu kontrol edin
import TextInputComponent from './components/Input'; // TextInput bileşenini dahil ettik
import ForgotPassword from './components/ForgotPassword';
const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleForgotPassword = () => {
    Alert.alert("Şifremi Unuttum", "Şifre sıfırlama linki e-posta adresinize gönderildi.");
  };
  return (
    <View style={styles.container}>
      {/* Üstte ortalanmış ikon */}
      <IconFrame imageSource={require('./assets/myIcon.png')} />

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

      <ForgotPassword onPress={handleForgotPassword} />

      {/* Giriş Butonu */}
      <ButtonComponent title="Giriş Yap" onPress={() => alert('Giriş yapıldı!')} />
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
});

export default App;
