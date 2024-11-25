import React from 'react';
import { View } from 'react-native';
import TextInputComponent from './Input';

const FormComponent = ({ formData, handleChange }) => {
  return (
    <View>
      {['firstName', 'lastName', 'email', 'username', 'password', 'confirmPassword'].map((field, index) => (
        <TextInputComponent
          key={index}
          placeholder={field === 'firstName' ? "Ad" : 
                      field === 'lastName' ? "Soyad" : 
                      field === 'email' ? "E-posta" : 
                      field === 'username' ? "Kullanıcı Adı" : 
                      field === 'password' ? "Şifre" : 
                      "Şifreyi Yeniden Giriniz"}
          secureTextEntry={field === 'password' || field === 'confirmPassword'}
          value={formData[field]}
          onChangeText={(value) => handleChange(field, value)}
          keyboardType={field === 'email' ? 'email-address' : 'default'}
          autoCapitalize="none"
        />
      ))}
    </View>
  );
};

export default FormComponent;
