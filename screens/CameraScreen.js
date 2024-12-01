import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Camera, CameraType, CameraView } from 'expo-camera';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState('back'); // Kamera tipi, arka kamera varsayılan olarak

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Loading...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Kamera bileşeni */}
      <CameraView style={styles.camera} CameraType={type} />
      
      {/* Kamera tipi değiştirilebilir */}
      <View style={styles.buttonContainer}>
        <Button title="Switch Camera" onPress={() => setType(type === 'back' ? 'front' : 'back')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
  },
});

export default CameraScreen;
