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
    color: '#FFB6C1',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center', 
    marginTop: 10,
    marginBottom: 20,
    left: 140,
    textDecorationLine: 'underline',
  },
});

export default ForgotPassword;
