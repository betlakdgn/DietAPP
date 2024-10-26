import React from 'react';
import { View } from 'react-native';
import ButtonComponent from './LogButtons'; // Daha önce oluşturduğunuz buton bileşeni

const ProfileButtons = ({ onProfilePress, onAllergiesPress, navigation }) => {
  return (
    <View>
      <ButtonComponent title="Profilim" targetScreen={""} />
      <ButtonComponent title="Alerjilerim" targetScreen={"Allergies"} />
    </View>
  );
};


export default ProfileButtons;
