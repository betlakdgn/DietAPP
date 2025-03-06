import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';

const CameraIcon = ({ setPhoto }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePhotoSelection = () => {
    setIsModalVisible(true); 
  };

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('İzin Gerekli', 'Kamerayı kullanabilmek için izin vermelisiniz.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri); 
      uploadPhoto(result.assets[0].uri); 
    }
    setIsModalVisible(false); 
  };

  const handleGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('İzin Gerekli', 'Galeriyi kullanabilmek için izin vermelisiniz.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri); 
      uploadPhoto(result.assets[0].uri); 
    }
    setIsModalVisible(false); 
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
        alert('Başarılı', 'Fotoğraf başarıyla yüklendi!');
        console.log('Fotoğraf URL:', data.url);
      }
    } catch (error) {
      //console.error('Fotoğraf yükleme hatası:', error);
      //alert('Hata', 'Fotoğraf yüklenirken bir hata oluştu.');
    }
  };

  return (
    <View style={styles.iconContainer}>
      <Icon name="camera-alt" size={22} color="white" onPress={handlePhotoSelection} />
      
     
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Fotoğraf Seç</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCamera}>
              <View style={styles.buttonContent}>
                <Icon name="camera" size={20} color="white" />
                <Text style={styles.buttonText}>Kamera</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleGallery}>
              <View style={styles.buttonContent}>
                <Icon name="image" size={20} color="white" />
                <Text style={styles.buttonText}>Galeriden Seç</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsModalVisible(false)}
            >
              <View style={styles.buttonContent}>
                <Icon name="close" size={20} color="white" />
                <Text style={styles.buttonText}>İptal</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#FFB6C1',
    width: 35,
    height: 35,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 15,
    marginBottom: 10,
    backgroundColor: '#FFB6C1',
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row', 
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 10, 
  },
});

export default CameraIcon;
