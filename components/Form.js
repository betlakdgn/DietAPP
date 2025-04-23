import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TextInputComponent from './Input';
import ButtonComponent from './ButtonComponent';

const FormComponent = ({ formData, handleChange }) => {
  const [errors, setErrors] = useState({});

  
  const validate = () => {
    let newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "Ad alanı boş olamaz";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Soyad alanı boş olamaz";
    }
    if (!formData.email) {
      newErrors.email = "E-posta alanı boş olamaz";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçersiz e-posta adresi";
    }
    if (!formData.password) {
      newErrors.password = "Şifre alanı boş olamaz";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <View style={styles.container}>
      {['firstName', 'lastName', 'email', 'password', 'confirmPassword'].map((field, index) => (
        <View key={index} style={styles.inputContainer}>
          <TextInputComponent
            placeholder={field === 'firstName' ? "Ad" : 
                        field === 'lastName' ? "Soyad" : 
                        field === 'email' ? "E-posta" :  
                        field === 'password' ? "Şifre" : 
                        "Şifreyi Yeniden Giriniz"}
            secureTextEntry={field === 'password' || field === 'confirmPassword'}
            value={formData[field]}
            onChangeText={(value) => handleChange(field, value)}
            keyboardType={field === 'email' ? 'email-address' : 'default'}
            autoCapitalize="none"
          />
          {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 10,
    width:'100%',
    
  },
  errorText: {
    color: '#D9534F', 
    fontSize: 12,
    marginTop: 5,
  },
});

export default FormComponent;
