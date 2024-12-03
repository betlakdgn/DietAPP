import React from 'react';
import { View, StyleSheet } from 'react-native';
import CameraScreen from './CameraScreen';  
import BottomButtons from '../components/BottomButtons'; 

const MainScreen = () => {
  return (
    <View style={styles.container}>
      
      <CameraScreen />

      
      <BottomButtons />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
  },
});

export default MainScreen;
