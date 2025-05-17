import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { usePhotoProcessing } from '../hooks/usePhotoProcessing';
import HealthScoreBar from '../components/HealthScoreBar';
import AllergyWarnings from '../components/AllergyWarnings';
import SaveButton from '../components/SaveButton';
import SavePhotoModal from '../components/SavePhotoModal';
import { savePhotoWithData } from '../utils/firebaseHelpers';
import PhotoWithBadge from '../components/PhotoWithBadge';

const PhotoPreview = ({ route }) => {
  const { photoUri, scannedIngredients, nuritionData } = route.params;
  const { loading, matchedAllergies, isAllergySafe, ocrText } = usePhotoProcessing(photoUri, scannedIngredients);

  const [modalVisible, setModalVisible] = useState(false);
  const [photoName, setPhotoName] = useState('');


  const user = useAuth();
  const navigation = useNavigation();

  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start();
  }, []);

  const score = nuritionData ? calculateHealthScore(nuritionData) : 0;

  const handleSave = () => {
    if (!user) {
      Alert.alert('Uyarı', 'Giriş yapmadınız. Giriş yapmak ister misiniz?', [
        { text: 'İptal', style: 'cancel' },
        { text: 'Giriş Yap', onPress: () => navigation.navigate('MainLoginPage') },
      ]);
      return;
    }
    setModalVisible(true);
  };

  const handleSavePhoto = async (name) => {
    if (!name?.trim()) {
      Alert.alert('Hata', 'Fotoğraf için bir isim girmeniz gerekiyor!');
      return;
    }

    try {
      await savePhotoWithData({
        photoUri,
        photoName: name,
        matchedAllergies,
        isAllergySafe,
      });
      setModalVisible(false);
      Alert.alert('Başarılı', 'Fotoğraf başarıyla kaydedildi!');
      navigation.navigate('Saved');
    } catch (err) {
      Alert.alert('Hata', 'Kaydedilirken hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}
        {!loading && <PhotoWithBadge isAllergySafe={isAllergySafe} />}
      </View>

      <Animated.View style={[styles.bottomContainer, { transform: [{ translateY: slideAnim }] }]}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <HealthScoreBar score={score} />
            <AllergyWarnings matchedAllergies={matchedAllergies} />
            <SaveButton onPress={handleSave} />
          </>
        )}
      </Animated.View>

      <SavePhotoModal visible={modalVisible} onClose={() => setModalVisible(false)} onSave={handleSavePhoto} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  imageContainer: {
    width: '100%',
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { 
    width: '100%', 
    height: '120%', 
    resizeMode: 'cover' 
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
    paddingBottom: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
});

export default PhotoPreview;
