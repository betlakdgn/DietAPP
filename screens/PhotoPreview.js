import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ActivityIndicator } from 'react-native';
import BackButton from '../components/BackButton';
import * as FileSystem from 'expo-file-system';  // Expo'nun FileSystem modülünü import ettik
import * as ImageManipulator from 'expo-image-manipulator'; // Resim manipülasyonu için import ettik

const PhotoPreview = ({ route }) => {
  const { photoUri } = route.params;  
  const [ocrResult, setOcrResult] = useState(''); // OCR sonucu için state
  const [loading, setLoading] = useState(true); // Yükleme durumu başlangıçta aktif

  const handleOcrProcess = async () => {
    const API_KEY = 'K83471230088957'; // OCR.Space API anahtarınızı ekleyin
    const url = 'https://api.ocr.space/parse/image';

    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        photoUri, 
        [{ resize: { width: 800 } }], 
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } 
      );

      
      const base64Image = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: FileSystem.EncodingType.Base64,  
      });

      // Görüntü formatını "image/jpeg" olarak belirleyin
      const mimeType = 'image/jpeg'; 
      const base64ImageWithType = `data:${mimeType};base64,${base64Image}`;

      // OCR API'ye istek gönder
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `apikey=${API_KEY}&base64Image=${encodeURIComponent(base64ImageWithType)}`,
      });

      const result = await response.json();
      console.log('OCR API Yanıtı:', result);

      // API yanıtında metni al
      if (result?.ParsedResults?.length > 0) {
        const parsedText = result.ParsedResults[0]?.ParsedText || 'Metin bulunamadı';
        setOcrResult(parsedText); // OCR sonucunu kaydet
      } else {
        setOcrResult('OCR işlemi sonucu bulunamadı.');
      }
      
      setLoading(false); // Yüklemeyi durdur
    } catch (error) {
      console.error('OCR Hatası:', error);
      setOcrResult('OCR işleminde bir hata oluştu.');
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde OCR işlemini başlat
  useEffect(() => {
    handleOcrProcess();
  }, []); // Boş bir bağımlılık dizisiyle yalnızca bir kez çalışır

  return (
    <View style={styles.container}>
      <BackButton targetScreen="MainScreen" />
      
      <View style={styles.imageContainer}>
        <Image source={{ uri: photoUri }} style={styles.image} />
      </View>

      <View style={styles.bottomContainer}>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {ocrResult ? <Text style={styles.ocrText}>{ocrResult}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
  imageContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover',
  },
  bottomContainer: {
    flex: 2, 
    backgroundColor: 'transparent',
    padding: 10,
  },
  ocrText: {
    marginTop: 20,
    fontSize: 16,
    color: '#000',
  },
});

export default PhotoPreview;
