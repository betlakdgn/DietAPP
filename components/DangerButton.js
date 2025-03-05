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
    backgroundColor: '#FF6F61',  // Soft red
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,  // Rounded corners for a smoother look
    alignItems: 'center',
    marginVertical: 8,
    elevation: 3, 
  },
  buttonText: {
    color: '#FFFFFF',  // White text for contrast
    fontSize: 16,
    fontWeight: '500', 
  },
});

export default DangerButton;
