import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TextInputComponent from './Input';

const defaultFields = [
  { name: 'firstName', placeholder: 'Ad', secureTextEntry: false },
  { name: 'lastName', placeholder: 'Soyad', secureTextEntry: false },
  { name: 'email', placeholder: 'E-posta', secureTextEntry: false, keyboardType: 'email-address' },
  { name: 'password', placeholder: 'Şifre', secureTextEntry: true },
  { name: 'confirmPassword', placeholder: 'Şifreyi Onayla', secureTextEntry: true }
];

const FormComponent = ({ formData, handleChange, errors, fields = defaultFields }) => (
  <View>
    {fields.map((field) => (
      <React.Fragment key={field.name}>
        <TextInputComponent
          placeholder={field.placeholder}
          value={formData[field.name]}
          onChangeText={(text) => handleChange(field.name, text)}
          secureTextEntry={field.secureTextEntry}
          keyboardType={field.keyboardType || 'default'}
        />
        {errors[field.name] && <Text style={{color: 'red'}}>{errors[field.name]}</Text>}
      </React.Fragment>
    ))}
  </View>
);


const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'center',
    width: '100%',
  },
  inputContainer: {
    marginBottom: 10,
    width: '100%',
  },
  errorText: {
    color: '#D9534F',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default FormComponent;
