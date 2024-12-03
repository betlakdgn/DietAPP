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
    position: 'absolute', 
    top: 60,
    left: 20,
    zIndex: 1,
    
  },
  icon: {
    fontSize: 30, 
    color: 'gray', 
  },
});

export default BackButton;
