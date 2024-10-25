import React from 'react';
import { View } from 'react-native';
import ButtonComponent from './LogButtons'; // Daha önce oluşturduğunuz buton bileşeni

const ProfileButtons = ({ onProfilePress, onAllergiesPress }) => {
  return (
    <View>
      <ButtonComponent title="Profilim" onPress={onProfilePress} />
      <ButtonComponent title="Alerjilerim" onPress={onAllergiesPress} />
    </View>
  );
};


export default ProfileButtons;
