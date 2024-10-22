// components/FormComponent.js
import React from 'react';
import { View } from 'react-native';
import TextInputComponent from './Input';

const FormComponent = ({ formData, handleChange }) => {
  return (
    <View>
      {['firstName', 'lastName', 'username', 'password', 'confirmPassword'].map((field, index) => (
        <TextInputComponent
          key={index}
          placeholder={field === 'firstName' ? "Ad" : 
                      field === 'lastName' ? "Soyad" : 
                      field === 'username' ? "Kullanıcı Adı" : 
                      field === 'password' ? "Şifre" : 
                      "Şifreyi Yeniden Giriniz"}
          secureTextEntry={field.includes('password')}
          value={formData[field]}
          onChangeText={(value) => handleChange(field, value)}
        />
      ))}
    </View>
  );
};

export default FormComponent;
