import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import IconFrame from '../components/IconFrame';
import ButtonComponent from '../components/LogButtons';
import FormComponent from '../components/Form';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = () => {
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor. Lütfen kontrol edin.");
      return;
    }
    Alert.alert("Kayıt Ol", "Kayıt işlemi başarıyla tamamlandı.");
  };

  return (
    <View style={styles.container}>
      <IconFrame imageSource={require('./assets/myIcon.png')} />
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
