import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileFrame from '../components/ProfilePhotoFrame'; // Profil fotoğraf çerçevesi bileşeni
import ProfileButtons from '../components/ProfileButton'; // Profil butonları bileşeni
import CameraIcon from '../components/CameraIcon';
import DangerButton from '../components/DangerButton';

const Profile = ({targetScreen}) => {
  const navigation = useNavigation(); 
  return (
    <View style={styles.container}>
      {/* Sol üst köşede profil fotoğraf çerçevesi */}
      <View style={styles.profileContainer}>
        <ProfileFrame /> 
        <View style={styles.cameraIconContainer}>
          <CameraIcon/>
        </View>

      </View>

      {/* Profil butonları yatay sırada */}
      <View style={styles.buttonsContainer}>
        <ProfileButtons/>
        <View style={styles.signout} >
         <DangerButton title={"çıkış"} onPress={()=> navigation.navigate(targetScreen="MainLoginPage")} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileContainer: {
    position: 'absolute', // Üst sol köşeye yerleştirme
    top: 80,
    left: 20,
  },
  cameraIconContainer:{
    position: 'absolute',
    bottom: 20,
    right: 8,

  },
  buttonsContainer: {
    flexDirection: 'column ', 
    justifyContent: 'space-around',
    alignItems: 'scretch',
    marginTop: 200,
    width: '100%',
  },
  signout:{
    position: 'absolute',
    width:150,
    height:150,
    left:110,
    top: 500,

    

  }
});

export default Profile;
