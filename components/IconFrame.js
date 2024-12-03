import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const IconFrame = ({ imageSource }) => {
  return (
    <View style={styles.iconContainer}>
      <Image source={imageSource} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#fbcfe8',   
    width: 105,                  
    height: 105,                 
    borderRadius: 50,            
    justifyContent: 'center',    
    alignItems: 'center',        
    shadowColor: '#ec4899',         
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1,          
    shadowRadius: 45,             
    elevation: 10,               // Android gölgelendirme
    marginBottom:50,
  },
  icon: {
    width: 100,                  
    height: 100,                  
    borderRadius: 40,            
  },
});

export default IconFrame;
