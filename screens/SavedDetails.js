import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Animated } from 'react-native';
import HealthScoreBar from '../components/HealthScoreBar';
import { alert } from '../components/alertService';

const SavedDetails = () => {
  const route = useRoute();

  const [photoDetails, setPhotoDetails] = useState(null);
  const navigation = useNavigation();
  const { photo } = route.params;

  const [editMode, setEditMode] = useState(false);
  const [newPhotoName, setNewPhotoName] = useState(photo?.photoName || '');

  const matchedAllergies = Array.isArray(photo?.matchedAllergies) ? photo.matchedAllergies : [];

  const slideAnim = useRef(new Animated.Value(300)).current;
  
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (photo?.photoName) {
      setNewPhotoName(photo.photoName);
    }
  }, [photo]);
  
  useEffect(() => {
    const fetchPhotoDetails = async () => {
      try {
        const docRef = doc(db, 'savedPhotos', photo.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPhotoDetails(docSnap.data());
        } else {
          console.log('Belge bulunamadı!');
        }
      } catch (err) {
        console.error('Veri çekme hatası:', err);
      }
    };
  
    if (photo?.id) {
      fetchPhotoDetails();
    }
  }, [photo]);

  
  const safePhoto = {
    ...photo,
    ...photoDetails,
    photoName: photoDetails?.photoName || photo?.photoName || '',
    matchedAllergies: Array.isArray(photoDetails?.matchedAllergies) ? photoDetails.matchedAllergies : [],
    createdAt: photoDetails?.createdAt?.toDate?.() || new Date(), 
    nutritionData: photoDetails?.nutritionData || null,
    healthScore: photoDetails?.healthScore || 0,
  };
  

  const handleEdit = async () => {
    try {
      const photoRef = doc(db, 'savedPhotos', safePhoto.id);
      await updateDoc(photoRef, {
        photoName: newPhotoName,
      });
      // Güncel veriyi tekrar çek
      const updatedDoc = await getDoc(photoRef);
      if (updatedDoc.exists()) {
        setPhotoDetails(updatedDoc.data());
      }
      setEditMode(false);
      alert('Başarılı', 'Fotoğraf ismi güncellendi.');
    } catch (error) {
      alert('Hata', `Fotoğraf güncellenemedi. Hata: ${error.message}`);
    }
  };


  const handleDelete = async () => {
    alert(
      'Fotoğrafı Sil',
      'Bu fotoğrafı silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const photoRef = doc(db, 'savedPhotos', safePhoto.id);
              await deleteDoc(photoRef);
              alert('Silindi', 'Fotoğraf silindi.');
              navigation.navigate('Saved', { refresh: true });
            } catch (error) {
              alert('Hata', `Fotoğraf silinemedi. Hata: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
       {photo?.photoUri && photo.photoUri !== 'placeholder' ? (
          <Image source={{ uri: photo.photoUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, { backgroundColor: 'white', justifyContent:'center', alignItems:'center' }]}>
          </View>
        )}

        
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => setEditMode(!editMode)} style={styles.icon}>
            <Icon name="edit" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.icon}>
            <Icon name="delete" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={[styles.bottomContainer, { transform: [{ translateY: slideAnim }] }]}>
        {editMode ? (
          <>
            <TextInput
              style={styles.input}
              value={newPhotoName}
              onChangeText={setNewPhotoName}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleEdit}>
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.photoName}>{safePhoto.photoName}</Text>

            <View style={styles.nutritionContainer}>
              <Text style={styles.infoText}>Besin Değerleri:</Text>
              {safePhoto.nutritionData ? (
                <>
                  <Text style={styles.nutritionText}>Karbonhidrat: {safePhoto.nutritionData.carbohydrates?.toFixed(1)} g</Text>
                  <Text style={styles.nutritionText}>Yağ: {safePhoto.nutritionData.fat?.toFixed(1)} g</Text>
                  <Text style={styles.nutritionText}>Protein: {safePhoto.nutritionData.proteins?.toFixed(1)} g</Text>
                  <Text style={styles.infoText}>Sağlık Skoru: {safePhoto.healthScore}</Text>
                  <HealthScoreBar score={safePhoto.healthScore} />

                </>
              ) : (
                <Text style={styles.nutritionText}>Besin bilgisi yok</Text>
              )}
            </View>

            <Text style={styles.infoText}>Eşleşen Alerjiler: </Text>
            {safePhoto.matchedAllergies.length > 0 ? (
              safePhoto.matchedAllergies.map((item, index) => (
                <Text key={index} style={styles.alergies}>- {item}</Text>
              ))
            ) : (
              <Text style={styles.alergies}>Yok</Text>
            )}

            <Text style={styles.dateText}>Tarih: {new Date(safePhoto.createdAt).toLocaleString()}</Text>

          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffb6c1',
  },
  imageWrapper: {
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
  },
  iconContainer: {
    position: 'absolute',
    top: 40,
    right: 10,
    flexDirection: 'row',
    gap: 10,
  },
  icon: {
    backgroundColor: 'black',
    padding: 6,
    borderRadius: 20,
    marginLeft: 8,
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
  photoName: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 20,
    marginBottom: 5,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 30,
  },
  input: {
    borderBottomWidth: 1,
    fontSize: 18,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFB6C1',
    fontWeight: 'bold',
  },
  alergies: {
    fontSize: 16,
    color: 'black',
  },
  nutritionContainer: {
  marginTop: 20,
  },
  nutritionText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  dateText: {
    fontSize:16,
    marginTop:155,
  }

});

export default SavedDetails;
