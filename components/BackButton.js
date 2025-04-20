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
    padding: 10,
    position: 'absolute',
    top: 40, 
    left: 15,
    zIndex: 1,
    
  },
  icon: {
    fontSize: 30,
    color: '#FFB6C1',
  },
});

export default BackButton;
