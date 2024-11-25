import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import IconFrame from '../components/IconFrame';
import ButtonComponent from '../components/ButtonComponent';
import FormComponent from '../components/Form';
import BackButton from '../components/BackButton';
import { signUp } from '../firebase'; // Firebase işlemleri

const SignUp = ({navigation}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor. Lütfen kontrol edin.");
      return;
    }

    try {
      // Firebase ile kayıt işlemi
      const user = await signUp(email, password);
      Alert.alert("Başarılı", `Hoş geldiniz, ${user.email}!`);
      navigation.navigate('Profile');
    } catch (error) {
      console.error("Kayıt hatası:", error);
      Alert.alert("Hata", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton targetScreen="MainLoginPage" />
      <IconFrame imageSource={require('../assets/myIcon.png')} />
      <FormComponent formData={formData} handleChange={handleChange} />
      <ButtonComponent title="Kaydol" onPress={handleSignUp} />
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
});

export default SignUp;
