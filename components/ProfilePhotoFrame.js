import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const ProfileFrame = ({ imageSource }) => {
  return (
    <View style={styles.frame}>
      <Image source={imageSource} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
    overflow: 'hidden',
    alignSelf:'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexDirection:'column',
    
    

    
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});

export default ProfileFrame;
