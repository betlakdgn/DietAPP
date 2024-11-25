import React, { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from '@expo/vector-icons';

const BottomButtons = () => {
  const navigation = useNavigation();

  const handleLeftButtonPress = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken'); // Giriş durumunu kontrol et
      if (userToken) {
        navigation.navigate('Profile'); // Giriş yapılmışsa Profile ekranına yönlendir
      } else {
        navigation.navigate('MainLoginPage'); // Giriş yapılmamışsa MainLoginPage'e yönlendir
      }
    } catch (error) {
      console.error('Giriş durumu kontrol edilemedi:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, styles.leftButton]}
        onPress={handleLeftButtonPress}
      >
        <FontAwesome name="user" size={35} color="white" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.rightButton]}
        onPress={() => navigation.navigate("CameraScreen")}
      >
        <FontAwesome name="image" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    position: 'absolute',
    marginTop: 700,
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
