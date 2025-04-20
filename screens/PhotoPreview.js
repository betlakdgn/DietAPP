import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ActivityIndicator,Alert, ScrollView } from 'react-native';
import BackButton from '../components/BackButton';
import * as FileSystem from 'expo-file-system'; 
import * as ImageManipulator from 'expo-image-manipulator'; 
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import foodAllergens from '../data/food_allergens.json';

const PhotoPreview = ({ route }) => {
  const { photoUri } = route.params;  
  const [ocrResult, setOcrResult] = useState(''); 
  const [loading, setLoading] = useState(true); 

   
  const [userAllergies, setUserAllergies] = useState([]);
  const [dataset, setDataset] = useState([]);

  const [isAllergyMatch, setIsAllergyMatch] = useState(false);
  const [isAllergySafe, setIsAllergySafe] = useState(false);
  const [matchedAllergies, setMatchedAllergies] = useState([]);

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

    const fetchDataset = async () => {
      try {
        setDataset(foodAllergens);
      } catch (error) {
        console.error("Error setting dataset:", error);
      }
    };
    

    fetchAllergies();
    fetchDataset();
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
        compareAllergies(parsedText); 
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
  
    console.log("Matched Foods:", matchedFoods);
  
    const matchedAllergies = matchedFoods
      .map((food) => foodAllergenMap[food])
      .filter(Boolean);
  
    console.log("Matched Allergies:", matchedAllergies);
  
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

  useEffect(() => {
    handleOcrProcess();
  }, []); 

  return (
    <View style={styles.container}>
      <BackButton targetScreen="MainScreen" />
      
      <View style={styles.imageContainer}>
        <Image source={{ uri: photoUri }} style={styles.image} />
        {isAllergyMatch && (
          <View style={[styles.stamp, isAllergySafe ? styles.safe : styles.notSafe]}>
            <Text style={styles.stampText}>
              {isAllergySafe ? 'Uygun' : 'Uygun Değil'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottomContainer}>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>
        {isAllergyMatch && (
          <View style={styles.alertListContainer}>
            <Text style={styles.alertListTitle}>UYARILAR:</Text>
            <ScrollView>
              {matchedAllergies.map((allergy, index) => (
                <Text key={index} style={styles.alertItem}>-{allergy}</Text>
              ))}
            </ScrollView>
            </View>
        )}
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
    position: 'relative',
  },
  image: {
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover',
  },
  stamp: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  notSafe: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)', 
  },
  safe: {
    backgroundColor: 'rgba(0, 255, 0, 0.7)', 
  },
  stampText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomContainer: {
    flex: 2, 
    backgroundColor: 'transparent',
    padding: 10,
  },
  alertListContainer: {
    padding:18,
    bottom:20,
  },
  alertListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertItem: {
    fontSize: 16,
    color: 'black',
  },
});

export default PhotoPreview;
