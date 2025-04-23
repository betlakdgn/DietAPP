import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SaveButton = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
      }}
      onPress={onPress}
    >
      <Ionicons name="bookmark-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

export default SaveButton;