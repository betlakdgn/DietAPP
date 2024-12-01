import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import IconFrame from '../components/IconFrame';
import ButtonComponent from '../components/ButtonComponent';
import FormComponent from '../components/Form';
import BackButton from '../components/BackButton';
import {validateForm} from '../utils/validation';
import {auth} from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
  const navigation =useNavigation();
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
    const error = validateForm(formData);

    if (error) {
      Alert.alert("Hata", error);
      return;
    }

    const { email, password } = formData;
  
    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      Alert.alert("Başarılı", `Hoş geldiniz, ${user.firstName}!`);
      navigation.navigate('Profile');
    } catch (error) {
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
