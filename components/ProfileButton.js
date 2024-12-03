import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ButtonComponent from './ButtonComponent'; 

const ProfileButtons = ({ onProfilePress, onAllergiesPress, targetScreen }) => {
  const navigation = useNavigation();
  return (
    <View>
      <ButtonComponent title="Profilim"  />
      <ButtonComponent title="Alerjilerim"  onPress={()=> navigation.navigate(targetScreen="Allergies")}/>
    </View>
  );
};


export default ProfileButtons;
