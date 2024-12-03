import React from 'react';
import { TouchableOpacity, Image } from 'react-native';


const EyeIcon = ({ onPress, isSecure }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={isSecure ? require('../assets/eye-closed.png') : require('../assets/eye-open.png')}
        style={{ width: 20, height: 20 }}
      />
    </TouchableOpacity>
  );
};

export default EyeIcon;