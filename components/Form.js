import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TextInputComponent from './Input';
import ButtonComponent from './ButtonComponent';

const FormComponent = ({ formData, handleChange }) => {
  const [errors, setErrors] = useState({});

  // Form doğrulama işlevi
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
    <View>
      {['firstName', 'lastName', 'email', 'password', 'confirmPassword'].map((field, index) => (
        <View key={index}>
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
      {/*<ButtonComponent onPress={validate}>Kayıt Ol</ButtonComponent>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
  }
});

export default FormComponent;
