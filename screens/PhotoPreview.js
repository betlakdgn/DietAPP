import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import BackButton from '../components/BackButton';
import * as FileSystem from 'expo-file-system'; 
import * as ImageManipulator from 'expo-image-manipulator'; 
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import foodAllergens from '../data/food_allergens.json';
import { Animated } from 'react-native';

const PhotoPreview = ({ route }) => {
  const { photoUri } = route.params;
  const [ocrResult, setOcrResult] = useState(''); 
  const [loading, setLoading] = useState(true); 
  const [matchedAllergies, setMatchedAllergies] = useState([]); 
  const [isAllergySafe, setIsAllergySafe] = useState(true); 

  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

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
        console.log('Translated Text:', translatedText);
        
        // Eğer kullanıcı giriş yapmamışsa, sadece OCR sonucu bulunan alerjenleri göster
        if (auth.currentUser) {
          compareAllergies(translatedText);
        } else {
          setMatchedAllergies([]); // Giriş yapmayan kullanıcılar için eşleşen alerjiler yok
          setIsAllergySafe(true); // Güvenli (Çünkü karşılaştırma yapılmayacak)
          showOcrAllergens(translatedText); // OCR sonucundan alerjenleri al ve göster
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
      </Animated.View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  stampOverlay: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    borderWidth: 2,
    zIndex: 3,
  },
  stampText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#FFB6C1',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
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
