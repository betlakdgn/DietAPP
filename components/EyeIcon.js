import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const EyeIcon = ({ onPress, isSecure }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
      <FontAwesome
        name={isSecure ? 'eye' : 'eye-slash'}
        size={28}  
        color="#FFB6C1"  
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    padding: 8,  
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: 'bold', 
  },
});

export default EyeIcon;
