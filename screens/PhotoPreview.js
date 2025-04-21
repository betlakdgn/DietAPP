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
  const [userAllergies, setUserAllergies] = useState([]);
  const [matchedAllergies, setMatchedAllergies] = useState([]);
  const [isAllergyMatch, setIsAllergyMatch] = useState(false);
  const [isAllergySafe, setIsAllergySafe] = useState(false);

  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserAllergies(userDocSnap.data().selectedAllergies || []);
        }
      } catch (error) {
        console.error("Error fetching allergies:", error);
      }
    };


    fetchAllergies();
  }, []);

  useEffect(() => {
    handleOcrProcess(); 
  }, []);

  const handleOcrProcess = async () => {
    const API_KEY = 'K83471230088957'; // OCR.Space API anahtarı
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
        translateText(parsedText); // Çeviriyi başlatıyoruz
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
    const GOOGLE_TRANSLATE_API_KEY = 'AIzaSyDU-lEpWpc2hiy9A-g50AZ81aJWYmeakg8'; // API anahtarınızı buraya ekleyin
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
      compareAllergies(translatedText);
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
      setIsAllergyMatch(true);
      setIsAllergySafe(false);  
    } else if (matchedAllergies.length > 0) {
      setIsAllergyMatch(true);
      setIsAllergySafe(true);  
    } else {
      setIsAllergyMatch(false);
      setIsAllergySafe(true);  
    }
    setMatchedAllergies(matchedAllergies);
  };

  return (
    <View style={styles.container}>

      <View style={styles.imageContainer}>
       <BackButton targetScreen="MainScreen" />
        <Image source={{ uri: photoUri }} style={styles.image} />

        <View style={[styles.stampOverlay, { borderColor: isAllergySafe ? 'green' : 'red' }]}>
          <Text style={[styles.stampText, { color: isAllergySafe ? 'green' : 'red' }]}>
            {isAllergySafe ? 'UYGUN' : 'UYGUN DEĞİL!'}
          </Text>
        </View>
      </View>

      <Animated.View style={[styles.bottomContainer, { transform: [{ translateY: slideAnim }] }]}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.alertListContainer}>
            <Text style={styles.alertListTitle}>UYARILAR:</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {matchedAllergies.length > 0 ? (
                matchedAllergies.map((allergy, index) => (
                  <Text key={index} style={styles.alertItem}>- {allergy}</Text>
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
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
    top: 200,
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
