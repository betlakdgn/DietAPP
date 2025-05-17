import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import BottomButtons from '../components/BottomButtons';
import { useBarcodeScanner } from '../components/BarcodeScannerManager';

const CameraScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] = useState('back');
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

  const [barcodeScanActive, setBarcodeScanActive] = useState(false);
  const { onBarcodeScanned, scanned, resetScan } = useBarcodeScanner(navigation);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await useCameraPermissions();
      setHasPermission(status === 'granted');
    };
    getPermissions();
  }, []);

  useEffect(() => {
    if (isFocused) resetScan();
  }, [isFocused]);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      navigation.navigate('PhotoPreview', { photoUri: photoData.uri });
    }
  };

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const toggleBarcodeScan = () => {
    setBarcodeScanActive((prev) => !prev);
    resetScan(); 
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          onBarcodeScanned={barcodeScanActive && !scanned ? onBarcodeScanned : undefined}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
          }}
        >
          <View style={styles.overlay}>
            <TouchableOpacity onPress={toggleCameraFacing} style={styles.button}>
              <FontAwesome name="exchange" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
              <FontAwesome name="camera" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleBarcodeScan} style={styles.barcodeButton}>
              <FontAwesome name="barcode" size={30} color={barcodeScanActive ? 'green' : 'white'} />
            </TouchableOpacity>

            <BottomButtons />
          </View>
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  camera: { 
    flex: 1, 
    width: '100%', 
    height: '100%'
  },
  overlay: { 
    flex: 1, 
    justifyContent: 'flex-end' 
  },
  button: {
    position: 'absolute',
    top: 50,
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
  barcodeButton: {
    position: 'absolute',
    right: 20,
    top:50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 50,
    zIndex: 10,
    
  },
});

export default CameraScreen;
