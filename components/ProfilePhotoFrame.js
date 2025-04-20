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
    width: 120,
    height: 120,
    borderRadius: 60, 
    borderWidth: 4,
    borderColor: '#FFB6C1', 
    backgroundColor: '#fff', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 60, 
    resizeMode: 'cover', 
  },
});

export default ProfileFrame;
