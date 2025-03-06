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
    borderRadius: 60, // Fully circular
    borderWidth: 4, // Thicker border
    borderColor: '#FFB6C1', // Soft pink border for a modern touch
    backgroundColor: '#fff', // White background inside the frame
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, // Adds shadow for Android devices
    marginBottom: 20,
    alignSelf: 'center', // Center the frame horizontally
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 60, // Ensure the image fits within the circular frame
    resizeMode: 'cover', // Makes sure the image covers the frame area without stretching
  },
});

export default ProfileFrame;
