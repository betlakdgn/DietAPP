import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const ProfileFrame = ({ photo }) => {
  return (
    <View style={styles.frame}>
      <Image source={{ uri: photo }} style={styles.image} />
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
    marginBottom: 20,
    alignSelf: 'flex-start',
    overflow: 'hidden',
    
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
});

export default ProfileFrame;
