import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const TextInputComponent = ({ placeholder, secureTextEntry, value, onChangeText }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default TextInputComponent;