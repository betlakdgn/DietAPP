import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ButtonComponent from './ButtonComponent'; 
import ProfileSettings from '../screens/ProfileSettings';
import Allergies from '../screens/Allergies';

const ProfileButtons = ({ onProfilePress, onAllergiesPress, targetScreen }) => {
  const navigation = useNavigation();
  return (
    <View>
      <ButtonComponent title="Profilim" onPress={()=>navigation.navigate(ProfileSettings)} />
      <ButtonComponent title="Alerjilerim"  onPress={()=> navigation.navigate(Allergies)}/>
    </View>
  );
};


export default ProfileButtons;
