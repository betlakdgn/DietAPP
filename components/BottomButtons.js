import React from "react";
import { useNavigation } from '@react-navigation/native';
import { View,TouchableOpacity,StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

const BottomButtons = (targetScreen) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity 
      style={[styles.button,styles.leftButton]}
      onPress={() => navigation.navigate("Login")}
      >
        <FontAwesome name="user" size={35} color="white" />
      </TouchableOpacity>

      <TouchableOpacity 
      style={[styles.button, styles.rightButton]}
      onPress={() => navigation.navigate(targetScreen)}
      >
        <FontAwesome name="image" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  
  button: {
    backgroundColor: '#4CAF50', // Butonların rengi
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    position:'absolute',
    marginTop:700,
    
    
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