import React, { useState } from 'react';
import { View, StyleSheet , Text, ImageBackground } from 'react-native';
import IconFrame from '../components/IconFrame';
import ButtonComponent from '../components/ButtonComponent';
import FormComponent from '../components/Form';
import BackButton from '../components/BackButton';
import {validateForm} from '../utils/validation';
import {auth} from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import {createUser} from '../firestoreService';
import backg from '../assets/backgroun.jpg';

const SignUp = () => {
  const navigation =useNavigation();
  const [errorMessage, setErrorMessage] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrorMessage({}); 
    setSuccessMessage('');
  };

  const handleSignUp = async () => {
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
      return;
    }


    const { email, password, firstName, lastName } = formData;
  
    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await createUser(user.uid, {
        firstName: firstName,
        lastName: lastName,
        email: email
      });

      setSuccessMessage(`Hoş geldiniz, ${firstName} ${lastName}!`);
      setErrorMessage({});
      navigation.navigate('Profile');
    } catch (error) {
      setErrorMessage({ email: error.message });
      setSuccessMessage('');
    }
  };

  return (
    <ImageBackground source={backg} style={styles.backgroundcontainer}>
        <View style={styles.overlay}>
            <IconFrame imageSource={require('../assets/myIcon.png')} />
            <FormComponent
              formData={formData}
              handleChange={handleChange}
              errors={errorMessage}
            />
                
            {successMessage !== '' && <Text style={styles.successText}>{successMessage}</Text>}

            <ButtonComponent title="Kaydol" onPress={handleSignUp} />
        </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundcontainer: {
    flex: 1,
  },
  overlay: {
    flex:1,
    justifyContent: 'center',   
    alignItems: 'center',       
    paddingHorizontal: 20,      
    paddingVertical: 40, 
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
    fontSize: 14,
  },
  successText: {
    color: 'green',
    marginVertical: 10,
    fontSize: 14,
  },
});

export default SignUp;
