import React from "react";
import { View,TouchableOpacity,StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

const BottomButtons = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button,styles.leftButton]}>
        <FontAwesome name="camera" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.rightButton]}>
        <FontAwesome name="image" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    height:100,
    backgroundColor: 'rgba(0, 0, 0, 0.0)', // Butonların arkasına şeffaf arka plan
  },
  button: {
    backgroundColor: '#4CAF50', // Butonların rengi
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    position:'absolute',
  },
  leftButton: {
    left: 0,
    borderTopRightRadius: 25, 
    borderBottomRightRadius: 25,
  },
  rightButton: {
    right: 0,
    borderTopLeftRadius: 25, 
    borderBottomLeftRadius: 25,
  }
  
});

export default BottomButtons;