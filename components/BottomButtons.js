import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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

  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("İzin Gerekli", "Lütfen galeriden fotoğraf seçmek için izin verin.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      console.log("Seçilen resim:", result.assets[0].uri);
      navigation.navigate('PhotoPreview', { photoUri: result.assets[0].uri });
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, styles.leftButton]}
        onPress={handleLeftButtonPress}
      >
        <FontAwesome name="user" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.rightButton]}
        onPress={pickImage} 
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
    bottom: 50, 
    flexDirection: 'row',
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    zIndex: 10, 
  },
  button: {
    backgroundColor: '#FFB6C1', 
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35, 
    elevation: 5,
  },
});

export default BottomButtons;
