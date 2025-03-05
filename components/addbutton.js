import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AddButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFB6C1',  // Soft pastel pink
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,  // More rounded edges for a soft look
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

export default AddButton;
