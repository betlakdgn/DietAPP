import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ForgotPassword = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.forgotPassword}>Şifremi Unuttum</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    color: '#3498db',
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    left:100,
  },
});

export default ForgotPassword;
