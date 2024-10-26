import React from "react";
import { View, StyleSheet } from "react-native";
import BottomButtons from "../components/BottomButtons";
import CameraScreen from './CameraScreen'; 

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
  },
});

export default MainScreen;
