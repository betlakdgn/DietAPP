import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const BottomButtons = () => {
  const navigation = useNavigation();

  const handleLeftButtonPress = async () => {
    try {
      const user = auth.currentUser; 
      if (user) {
        await AsyncStorage.setItem('userToken', user.uid); 
        navigation.navigate('Profile'); 
      } else {
        navigation.navigate('MainLoginPage'); 
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
        onPress={() => navigation.navigate("MainScreen")}
      >
        <FontAwesome name="image" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', 
    left: 0,
    right: 0,
    bottom: 80, 
    flexDirection: 'row',
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    zIndex: 10, 
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35, 
  },
});

export default BottomButtons;
