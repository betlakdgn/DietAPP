import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { FontAwesome} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomButtons from '../components/BottomButtons';
import {BarCodeScanner} from 'expo-barcode-scanner' ;

const CameraScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] = useState('back');  
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const [scanned, setScanned] = useState(false);

  
  const handleBarCodeScanned = async ({ data }) => {
  setScanned(true); // tekrar taramayı engellemek için

  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
    const json = await response.json();

    if (json.status === 1 && json.product?.ingredients_text) {
      const ingredients = json.product.ingredients_text;

      navigation.navigate('PhotoPreview', {
        scannedIngredients: ingredients,
        photoUri: null, // OCR yok
      });
    } else {
      Alert.alert('Ürün bulunamadı', 'Bu barkod için içerik bilgisi mevcut değil.');
      setScanned(false);
    }
  } catch (error) {
    console.error('API hatası:', error);
    Alert.alert('Hata', 'Ürün bilgisi alınamadı.');
    setScanned(false);
  }
  };

  

  useEffect(() => {
    (async () => {
      const { status } = await useCameraPermissions();
      setHasPermission(status === 'granted');
    })();
  }, []);

  /*if (hasPermission === null) {
    return <Text>Loading...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  */

  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData.uri);
      navigation.navigate('PhotoPreview', { photoUri: photoData.uri });  
    }
  };
 
  const toggleCameraFacing = () => {//çalışmıyor
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };



  return (
    <View style={styles.container}>
      <CameraView 
      style={styles.camera} 
      facing={facing} 
      ref={cameraRef}
      barcodeScannerSettings={{
        barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'qr'],
      }}
      onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <TouchableOpacity onPress={toggleCameraFacing} style={styles.button}>
            <FontAwesome name="exchange" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            <FontAwesome name="camera" size={30} color="white" />
          </TouchableOpacity>

          <BottomButtons />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    position: 'absolute',
    top: 30,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 50,
    zIndex: 10,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: [{ translateX: -35 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 50,
    zIndex: 10,
  },
});

export default CameraScreen;