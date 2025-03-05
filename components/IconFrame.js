import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const IconFrame = ({ imageSource }) => {
  const screenWidth = Dimensions.get('window').width; 
  const iconSize = screenWidth * 0.25; 

  return (
    <View style={[styles.iconContainer, { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }]}>
      <Image 
        source={imageSource } 
        style={[styles.icon, { width: iconSize * 0.95, height: iconSize * 0.95, borderRadius: iconSize * 0.475 }]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#fbcfe8',   
    justifyContent: 'center',    
    alignItems: 'center',        
    shadowColor: '#ec4899',         
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1,          
    shadowRadius: 45,             
    elevation: 10,               // Android shadow
    marginBottom: 50,
  },
  icon: {
    borderRadius: 50,  // Ensures the image inside the container is also rounded
  },
});

export default IconFrame;
