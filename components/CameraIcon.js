
import React from 'react';
import { View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const CameraIcon = () => {
  
  const handlePhotoSelection = () => {
    // Seçenekler menüsünü gösteriyoruz
    Alert.alert(
      "Fotoğraf Seç",
      "Kamera ya da Galeri Seçin",
      [
        {
          text: "Kamera",
          onPress: () => handleCamera(), 
        },
        {
          text: "Galeriden Seç",
          onPress: () => handleGallery(),
        },
        {
          text: "İptal",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleCamera = () => {
    const options = {
      mediaType: 'photo', 
      quality: 1, 
      cameraType: 'front', 
    };
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('Kullanıcı fotoğraf çekmekten vazgeçti');
        Alert.alert('İptal', 'Fotoğraf çekme işlemi iptal edildi.');
      } else if (response.errorCode) {
        console.log('Fotoğraf çekme hatası:', response.errorMessage);
        Alert.alert('Hata', 'Fotoğraf çekme işlemi başarısız.');
      } else {
        setPhoto(response.assets[0].uri);
      }
    });
  };

 
  const handleGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('Kullanıcı fotoğraf seçmekten vazgeçti');
        Alert.alert('İptal', 'Fotoğraf seçme işlemi iptal edildi.');
      } else if (response.errorCode) {
        console.log('Galeriden fotoğraf seçme hatası:', response.errorMessage);
        Alert.alert('Hata', 'Galeriden fotoğraf seçme işlemi başarısız.');
      } else {
        setPhoto(response.assets[0].uri); // Seçilen fotoğrafın URI'sini alıyoruz
      }
      console.log((response));
    });
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
