import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import ProfileFrame from '../components/ProfilePhotoFrame';
import ProfileButtons from '../components/ProfileButton';
import CameraIcon from '../components/CameraIcon';
import DangerButton from '../components/DangerButton';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';


const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  // Firebase'den veri çekme fonksiyonu
  const fetchData = async () => {
    try {
      if (!auth.currentUser) {
        Alert.alert("Hata", "Kullanıcı giriş yapmamış.");
        return;
      }
  
      const userId = auth.currentUser.uid;
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        Alert.alert("Hata", "Kullanıcı bilgileri bulunamadı.");
      }
    } catch (error) {
      console.error("Firestore bağlantı hatası:", error);
      Alert.alert("Hata", "Kullanıcı bilgileri alınırken bir hata oluştu.");
    }
  };
  

  useEffect(() => {
    fetchData();  // Sayfa yüklendiğinde veriyi çekiyoruz
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);  
      console.log('Kullanıcı çıkış yaptı');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainLoginPage' }],
      });
    } catch (error) {
      console.error('Çıkış yaparken hata oluştu:', error.message);
    }
  };

  return (
    <View style={styles.container}>
    {userData ? (
      <>
        
        <View style={styles.profileContainer}>
          <ProfileFrame />
          <View style={styles.textContainer}>
              <Text style={styles.text}>{`${userData?.firstName || ''} ${userData?.lastName || ''}`}</Text>
          </View>
          <View style={styles.cameraIconContainer}>
            <CameraIcon />
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
</View>

  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', 
    alignItems: 'center',
    justifyContent: 'flex-start', 
    padding: 20, 
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333', 
    textAlign: 'left',
  },
  profileContainer: {
    position: 'absolute', 
    top: 80,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10, // Profil fotoğrafı ile metin arasına boşluk ekle
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 150
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
  }
  
});


export default Profile;
