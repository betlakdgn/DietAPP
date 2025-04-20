import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const DangerButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF6F61',  
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 8,
    elevation: 3, 
  },
  buttonText: {
    color: '#FFFFFF',  
    fontSize: 16,
    fontWeight: '500', 
  },
});

export default DangerButton;
