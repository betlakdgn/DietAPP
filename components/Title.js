
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Title = ({ text }) => {
  return <Text style={styles.title}>{text}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28, 
    fontWeight: '800', 
    marginBottom: 10,
    marginTop:80,
    textAlign: 'center',
    color: '#333', 
    fontFamily: 'Roboto',
  },
});

export default Title;
