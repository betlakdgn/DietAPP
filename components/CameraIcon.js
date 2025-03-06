import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CameraIcon = ({setPhoto}) => {
  const [photo, setphoto] = useState(null);

  const handlePhotoSelection = () => {
    Alert.alert(
      "Fotoğraf Seç",
      "Kamera ya da Galeri Seçin",
      [
        { text: "Kamera", onPress: handleCamera },
        { text: "Galeriden Seç", onPress: handleGallery },
        { text: "İptal", style: "cancel" }
      ],
      { cancelable: true }
    );
  };


  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Kamerayı kullanabilmek için izin vermelisiniz.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri); // Seçilen fotoğrafın URI'sini kaydet
      uploadPhoto(result.assets[0].uri); // Fotoğrafı sunucuya yükle
    }
  };

  const handleGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Galeriyi kullanabilmek için izin vermelisiniz.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri); // Seçilen fotoğrafın URI'sini kaydet
      uploadPhoto(result.assets[0].uri); // Fotoğrafı sunucuya yükle
    }
  };

  const uploadPhoto = async (uri) => {
    const formData = new FormData();
    formData.append('photo', {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      const response = await fetch('85.104.67.185/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        Alert.alert('Başarılı', 'Fotoğraf başarıyla yüklendi!');
        setphoto(data.url)
        console.log('Fotoğraf URL:', data.url); 
        
      }
    } catch (error) {
      //console.error('Fotoğraf yükleme hatası:', error);
      //Alert.alert('Hata', 'Fotoğraf yüklenirken bir hata oluştu.');
    }
  };
  

  

  return (
    <View style={styles.iconContainer}>
      <Icon name="camera-alt" size={22} color="white" onPress={handlePhotoSelection} />
    </View>
  );
};

const styles = {
  iconContainer: {
    backgroundColor: '#FFB6C1',
    width: 35,
    height: 35,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
};

export default CameraIcon;
