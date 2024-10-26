import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackButton = ({targetScreen}) => {
  const navigation = useNavigation();
  

  return (
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(targetScreen)}>
      <Text style={styles.icon}>{'<'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 1,
    position: 'absolute', // Üst sol köşeye yerleştirme
    top: 60,
    left: 20,
    
    
  },
  icon: {
    fontSize: 30, // Iconun büyüklüğünü ayarlayın
    color: 'black', // Icon rengi
  },
});

export default BackButton;
