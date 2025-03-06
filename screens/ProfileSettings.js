import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebase';  // Firebase configuration
import { doc, getDoc, setDoc } from 'firebase/firestore';
import IconFrame from '../components/IconFrame';
import ButtonComponent from '../components/ButtonComponent';
import TextInputComponent from '../components/Input';
import BackButton from '../components/BackButton';
import background from '../assets/backg.jpg';

const ProfileSettings = () => {
  const navigation = useNavigation();
  
  const [firstName, setName] = useState('');
  const [lastName, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Get the authenticated user's UID dynamically
  const userUid = auth.currentUser?.uid;  // Use the current authenticated user's UID
  
  useEffect(() => {
    if (!userUid) {
      Alert.alert("Hata", "Kullanıcı kimliği alınamadı. Lütfen giriş yapın.");
      return;
    }

    // Fetch user data from Firestore on initial render
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', userUid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setName(userData.firstName || '');
          setSurname(userData.lastName || '');
          setEmail(userData.email || '');
        } else {
          console.log('User not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
        setErrorMessage('Bir hata oluştu, kullanıcı verileri alınamadı.');
      }
    };

    fetchUserData();
  }, [userUid]);

  const handleSaveProfile = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert("Hata", "Lütfen tüm bilgileri doldurun.");
      return;
    }
  
    setLoading(true);
  
    try {
      const userRef = doc(db, 'users', userUid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const updatedUserData = {
          ...userData,
          firstName,
          lastName,
          email,
        };
  
        // Save the updated data to Firestore
        await setDoc(userRef, updatedUserData);
  
        Alert.alert('Başarılı', 'Profiliniz başarıyla güncellendi');
        navigation.goBack();  // Navigate back to Profile screen to see the changes
      } else {
        console.log('User not found in Firestore');
        Alert.alert('Hata', 'Kullanıcı verisi bulunamadı.');
      }
    } catch (error) {
      console.error('Error updating profile: ', error);
      Alert.alert('Hata', `Profil güncellenirken bir hata oluştu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <ImageBackground source={background} style={styles.backgroundContainer}>
      <View style={styles.overlay}></View>

      <BackButton targetScreen="MainProfilePage" />

      <IconFrame imageSource={require('../assets/myIcon.png')} />

      <TextInputComponent
        placeholder="İsim"
        value={firstName}
        onChangeText={setName}
      />

      <TextInputComponent
        placeholder="Soyisim"
        value={lastName}
        onChangeText={setSurname}
      />

      <TextInputComponent
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {errorMessage !== '' && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}

      <ButtonComponent
        title={loading ? 'Yükleniyor...' : 'Kaydet'}
        onPress={handleSaveProfile}
        disabled={loading}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
});

export default ProfileSettings;
