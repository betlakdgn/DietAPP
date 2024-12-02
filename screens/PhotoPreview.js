import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import BackButton from '../components/BackButton';

const PhotoPreview = ({ route }) => {
  const { photoUri } = route.params;  

  return (
    <View style={styles.container}>

      <BackButton targetScreen="CameraScreen" />
      
      <View style={styles.imageContainer}>
        <Image source={{ uri: photoUri }} style={styles.image} />
      </View>

      
      <View style={styles.bottomContainer}></View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 2,
    },
    imageContainer: {
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%', 
      height: '100%', 
      resizeMode: 'cover',
    },
    bottomContainer: {
      flex: 2, 
      backgroundColor: 'transparent',
    },
  });

export default PhotoPreview;


