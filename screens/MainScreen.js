import React from "react";
import { View,StyleSheet } from "react-native";
import BottomButtons from "../components/BottomButtons";

const MainScreen = () => {
  return(
    <View style={styles.container}>
      <BottomButtons/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',//değişiklik yok
    paddingVertical: 10,
    height:100,
    backgroundColor: 'rgba(0, 0, 0, 0.0)', // Butonların arkasına şeffaf arka plan
  },
});

export default MainScreen;