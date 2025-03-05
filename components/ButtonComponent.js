import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ButtonComponent = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFB6C1', // Soft pastel pink
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // Rounded corners for a modern feel
    alignItems: 'center',
    marginVertical: 8,
    elevation: 3, // Soft shadow effect for depth
  },
  buttonText: {
    color: '#FFFFFF', // White text for contrast
    fontSize: 16,
    fontWeight: '500', // Lighter font weight for a modern feel
  },
});

export default ButtonComponent;
