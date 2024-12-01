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
      const user = auth.currentUser; // Firebase'deki mevcut kullanıcıyı kontrol et
      if (user) {
        await AsyncStorage.setItem('userToken', user.uid); // Kullanıcı token'ı kaydet
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
  container: {
    position: 'absolute', // Alt butonları kameranın önünde sabitliyoruz
    left: 0,
    right: 0,
    bottom: 80, // Alt kısmı 30px yapıyoruz
    flexDirection: 'row', // Butonları yatayda hizalıyoruz
    justifyContent: 'space-between', // Butonları ekranın sol ve sağ tarafına yerleştiriyoruz
    paddingHorizontal: 20, // Butonlar arasındaki boşluk için padding
    zIndex: 10, // Butonların kamera ekranının önünde görünmesini sağlıyoruz
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35, // Butonları yuvarlak yapıyoruz
  },
});

export default BottomButtons;
