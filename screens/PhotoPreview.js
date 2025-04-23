import React, { useState, useEffect, useRef } from 'react';
import {Alert, View, Image, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system'; 
import * as ImageManipulator from 'expo-image-manipulator'; 
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import foodAllergens from '../data/food_allergens.json';
import { Animated } from 'react-native';
import SaveButton from '../components/SaveButton';
import SavePhotoModal from '../components/SavePhotoModal';
import { useNavigation } from '@react-navigation/native';
import PhotoWithBadge from '../components/PhotoWithBadge';



const PhotoPreview = ({ route }) => {
  const { photoUri } = route.params;
  const [ocrResult, setOcrResult] = useState(''); 
  const [loading, setLoading] = useState(true); 
  const [matchedAllergies, setMatchedAllergies] = useState([]); 
  const [isAllergySafe, setIsAllergySafe] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false);
  const [photoName, setPhotoName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation();

  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  
    return () => unsubscribe(); 
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) {
      Alert.alert(
        'Uyarı',
        'Giriş yapmadınız. Giriş yapmak ister misiniz?',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Giriş Yap', onPress: () => navigation.navigate('MainLoginPage') },
        ],
        { cancelable: true }
      );
      return;
    }

    setModalVisible(true);
  };
  const handleSavePhoto = async (photoName) => {
    if (!photoName || photoName.trim() === '') {
      Alert.alert('Hata', 'Fotoğraf için bir isim girmeniz gerekiyor!');
      return;
    }
  
    try {
      const userId = auth.currentUser.uid;
      const docRef = doc(db, 'savedPhotos', `${userId}_${Date.now()}`);
  
      
      await setDoc(docRef, {
        userId,
        photoName: photoName || `Fotoğraf - ${new Date().toLocaleString()}`,
        photoUri,
        matchedAllergies,
        isAllergySafe,
        createdAt: new Date().toISOString()
      });
  
      setModalVisible(false); 
      Alert.alert('Başarılı', 'Fotoğraf başarıyla kaydedildi!');
      navigation.navigate('Saved');
    } catch (error) {
      console.error('Fotoğraf kaydedilirken hata oluştu:', error);
      Alert.alert('Hata', 'Fotoğraf kaydedilirken bir sorun oluştu.');
    }
  };

  useEffect(() => {
    handleOcrProcess(); 
  }, []);

  const handleOcrProcess = async () => {
    const API_KEY = 'K83471230088957';
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

      const mimeType = 'image/jpeg'; 
      const base64ImageWithType = `data:${mimeType};base64,${base64Image}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `apikey=${API_KEY}&base64Image=${encodeURIComponent(base64ImageWithType)}`,
      });

      const result = await response.json();
      if (result?.ParsedResults?.length > 0) {
        const parsedText = result.ParsedResults[0]?.ParsedText || 'Metin bulunamadı';
        setOcrResult(parsedText); 
        translateText(parsedText);
      } else {
        setOcrResult('OCR işlemi sonucu bulunamadı.');
      }
      setLoading(false);
    } catch (error) {
      console.error('OCR Hatası:', error);
      setOcrResult('OCR işleminde bir hata oluştu.');
      setLoading(false);
    }
  };

  const translateText = async (text) => {
    const GOOGLE_TRANSLATE_API_KEY = 'AIzaSyDU-lEpWpc2hiy9A-g50AZ81aJWYmeakg8';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: 'en',  
        }),
      });

      const responseData = await response.json();

      if (responseData.data && responseData.data.translations) {
        const translatedText = responseData.data.translations[0].translatedText;
        //console.log('Translated Text:', translatedText);
        
        
        if (auth.currentUser) {
          compareAllergies(translatedText);
        } else {
          setMatchedAllergies([]); 
          setIsAllergySafe(true); 
          showOcrAllergens(translatedText);
        }
      } else {
        console.error('Çeviri başarısız:', responseData);
      }
    } catch (error) {
      console.error('Çeviri Hatası:', error);
    }
  };

  const cleanOcrText = (text) => {
    return text
      .toLowerCase() 
      .replace(/[^a-z0-9\sçğıüöş]/g, '') 
      .trim(); 
  };

  const showOcrAllergens = (text) => {
    const cleanedText = cleanOcrText(text); 
    const foodAllergenMap = foodAllergens.reduce((acc, item) => {
      acc[item.Food.toLowerCase()] = item.Allergy;
      return acc;
    }, {});

    const matchedFoods = Object.keys(foodAllergenMap).filter((food) =>
      cleanedText.includes(food)
    );

    const matchedAllergies = matchedFoods
      .map((food) => foodAllergenMap[food])
      .filter(Boolean);

    setMatchedAllergies(matchedAllergies); 
  };

  const compareAllergies = async (text) => {
    const cleanedText = cleanOcrText(text); 
    const foodAllergenMap = foodAllergens.reduce((acc, item) => {
      acc[item.Food.toLowerCase()] = item.Allergy;
      return acc;
    }, {});

    const matchedFoods = Object.keys(foodAllergenMap).filter((food) =>
      cleanedText.includes(food)
    );

    const matchedAllergies = matchedFoods
      .map((food) => foodAllergenMap[food])
      .filter(Boolean);

    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        console.log("User document not found.");
        return;
      }

      const data = userDocSnap.data();
      const userCheckedAllergies = data.selectedAllergies || [];

      const selectedUserAllergies = matchedAllergies.filter((allergy) => 
        userCheckedAllergies.includes(allergy)
      );

      if (selectedUserAllergies.length > 0) {
        setIsAllergySafe(false);  
      } else if (matchedAllergies.length > 0) {
        setIsAllergySafe(true);  
      } else {
        setIsAllergySafe(true);  
      }
    }

    setMatchedAllergies(matchedAllergies);
  };

  

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: photoUri }} style={styles.image} />
        {matchedAllergies.length > 0 && (
          <PhotoWithBadge isAllergySafe={isAllergySafe} />
        )}
      </View>
  
      <Animated.View style={[styles.bottomContainer, { transform: [{ translateY: slideAnim }] }]}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.alertListContainer}>
            <Text style={styles.alertListTitle}>⚠️ UYARILAR:</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {matchedAllergies.length > 0 ? (
                matchedAllergies.map((allergy, index) => (
                  <Text key={index} style={styles.alertItem}>❗ {allergy}</Text>
                ))
              ) : (
                <Text style={styles.safeMessage}>Herhangi bir alerjen bulunamadı ✅</Text>
              )}
            </ScrollView>
          </View>
        )}
        
        <SaveButton onPress={handleSave}/>
      </Animated.View>
  
      <SavePhotoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(photoName) => {
          setPhotoName(photoName);
          handleSavePhoto(photoName);
        }}
      />

    </View>
  );
  
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: '50%',
    alignItems: 'stretch',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bottomContainer: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    bottom: 0, 
    backgroundColor: '#FFB6C1',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    paddingBottom: 60, 
  },
  alertListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertItem: {
    fontSize: 16,
    marginBottom: 6,
    color: 'black',
  },
  safeMessage: {
    fontSize: 16,
    color: 'black',
    fontStyle: 'italic',
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
});



export default PhotoPreview;
