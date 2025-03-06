import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import ProfileFrame from '../components/ProfilePhotoFrame';
import ProfileButtons from '../components/ProfileButton';
import CameraIcon from '../components/CameraIcon';
import DangerButton from '../components/DangerButton';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import backg from '../assets/backg.jpg';

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      Alert.alert("Hata", "Kullanıcı giriş yapmamış.");
      return;
    }

    
    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setPhoto(data.profilePhoto || null);
      } else {
        Alert.alert("Hata", "Kullanıcı bilgileri bulunamadı.");
      }
    });

    
    return () => unsubscribe();

  }, []);

  const handleSignOut = async () => {
    try {

      if (photo && auth.currentUser) {
        const userId = auth.currentUser.uid;
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { profilePhoto: photo });  // Fotoğrafı Firestore'a kaydet
      }

      await signOut(auth);  
      
      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainScreen' }]
        });
      } else {
        console.error("Navigation objesi bulunamadı.");
      }
    } catch (error) {
      console.error('Çıkış yaparken hata oluştu:', error.message);
    }
  };

  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const handlePhotoUpdate = (newPhotoUrl) => {
    setLoadingPhoto(true);
    setPhoto(newPhotoUrl);
    if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const userRef = doc(db, "users", userId);
        updateDoc(userRef, { profilePhoto: newPhotoUrl })
            .then(() => {
                setLoadingPhoto(false);
            })
            .catch((error) => {
                setLoadingPhoto(false);
                console.error('Firestore güncelleme hatası:', error);
            });
    }
  };


  

  return (
    <ImageBackground source={backg} style={styles.backgroundcontainer}>
      <View style={styles.overlay}></View>
   
      {userData ? (
        <>
          <View style={styles.profileContainer}>
            {photo ? (
              <ProfileFrame photo={photo} />
            ) : (
              <ProfileFrame />
            )}
            <View style={styles.textContainer}>
              <Text style={styles.text}>{`${userData?.firstName || ''} ${userData?.lastName || ''}`}</Text>
            </View>
            <View style={styles.cameraIconContainer}>
              <CameraIcon setPhoto={handlePhotoUpdate} />
            </View>
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}

      <View style={styles.buttonsContainer}>
        <ProfileButtons />
        <View style={styles.signout}>
          <DangerButton title={"Çıkış"} onPress={handleSignOut} />
        </View>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
    backgroundcontainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 20,
      backgroundColor: '#f5f5f5',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255, 255, 255, 0.4)', 
    },
    text: {
      fontSize: 28,
      fontWeight: '800',
      color: '#333', 
      textAlign: 'left',
      fontFamily: 'Roboto',
    },
    profileContainer: {
      position: 'absolute', 
      top: 80,
      left: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width:'100%',
    },
    textContainer: {
      marginLeft: 10, 
    },
    cameraIconContainer: {
      position: 'absolute',
      bottom: 20,
      right: 300,
    },
    buttonsContainer: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'stretch',
      marginTop: 300,
      width: '100%',
    },
    signout: {
      position: 'absolute',
      width: 150,
      height: 150,
      left: 110,
      top: 200,
    },
});


export default Profile;
