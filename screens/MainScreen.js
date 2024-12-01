import React from 'react';
import { View, StyleSheet } from 'react-native';
import CameraScreen from './CameraScreen';  // Kamera ekranını ekliyoruz
import BottomButtons from '../components/BottomButtons'; // Alt butonlar

const MainScreen = () => {
  return (
    <View style={styles.container}>
      {/* Kamera ekranı burada yer alacak */}
      <CameraScreen />

      {/* Alt butonlar, kameranın önünde yer alacak */}
      <BottomButtons />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Kamera ekranı tüm ekranı kapsar, butonlar üstte olacak
  },
});

export default MainScreen;
