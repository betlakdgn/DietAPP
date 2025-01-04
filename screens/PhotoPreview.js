import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ActivityIndicator,Alert } from 'react-native';
import BackButton from '../components/BackButton';
import * as FileSystem from 'expo-file-system';  // Expo'nun FileSystem modülünü import ettik
import * as ImageManipulator from 'expo-image-manipulator'; // Resim manipülasyonu için import ettik
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import foodAllergens from '../data/food_allergens.json';

const PhotoPreview = ({ route }) => {
  const { photoUri } = route.params;  
  const [ocrResult, setOcrResult] = useState(''); // OCR sonucu için state
  const [loading, setLoading] = useState(true); // Yükleme durumu başlangıçta aktif

   // Kullanıcı alerjilerini ve veri setini al
  const [userAllergies, setUserAllergies] = useState([]);
  const [dataset, setDataset] = useState([]);

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

      // API yanıtında metni al
      if (result?.ParsedResults?.length > 0) {
        const parsedText = result.ParsedResults[0]?.ParsedText || 'Metin bulunamadı';
        setOcrResult(parsedText); // OCR sonucunu kaydet
        compareAllergies(parsedText); // Karşılaştırmayı başlat
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
  const cleanOcrText = (text) => {
    // Küçük harfe çevirme, boşlukları temizleme ve özel karakterleri kaldırma
    return text
      .toLowerCase() // Küçük harfe çevir
      .replace(/[^a-z0-9\sçğıüöş]/g, '') // Özel karakterleri temizle
      .trim(); // Başındaki ve sonundaki boşlukları temizle
  };
  const compareAllergies = async (text) => {
    const cleanedText = cleanOcrText(text); 

    // Veritabanındaki yiyecek ve alerjen eşleşmelerini kontrol et
    const foodAllergenMap = foodAllergens.reduce((acc, item) => {
      acc[item.Food.toLowerCase()] = item.Allergy;
      return acc;
    }, {});
  
    // Temizlenmiş OCR metninde eşleşen yiyecekleri bul
    const matchedFoods = Object.keys(foodAllergenMap).filter((food) =>
      cleanedText.includes(food) // Temizlenmiş metinde yiyecek isminin geçip geçmediğini kontrol et
    );
  
    console.log("Matched Foods:", matchedFoods);
  
    // Eşleşen alerjenleri bul
    const matchedAllergies = matchedFoods
      .map((food) => foodAllergenMap[food])
      .filter(Boolean);
  
    console.log("Matched Allergies:", matchedAllergies);
  
    // Kullanıcının seçtiği (check edilmiş) alerjenleri alıyoruz
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);
  
    if (!userDocSnap.exists()) {
      console.log("User document not found.");
      return;
    }
  
    const data = userDocSnap.data();
    const userCheckedAllergies = data.selectedAllergies || [];
  
    
    // Seçilen (işaretli) alerjenleri ve eşleşmeleri kontrol et
    const selectedUserAllergies = matchedAllergies.filter((allergy) => 
      userCheckedAllergies.includes(allergy) // Yalnızca işaretlenen alerjenleri kontrol et
    );
  
    console.log("Selected User's Matched Allergies:", selectedUserAllergies);
  
    // Uyarı göster
    if (selectedUserAllergies.length > 0) {
      Alert.alert(
        "Uyarı",
        `Bu ürün sizin alerjinize uygun değil: ${selectedUserAllergies.join(", ")}`
      );
    } else if (matchedAllergies.length > 0) {
      Alert.alert(
        "Uyarı",
        `Bu ürün şu alerjenleri içeriyor: ${matchedAllergies.join(", ")}`
      );
    } else {
      Alert.alert("Bilgi", "Ürün alerjen içermiyor.");
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
