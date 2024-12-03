
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CameraIcon = () => {
  return (
    <View style={styles.iconContainer}>
      <Icon name="camera-alt" size={18} color="#fff" />
    </View>
  );
};

const styles = {
  iconContainer: {
    backgroundColor: '#4CAF50', 
    borderRadius: 15,
    padding: 4,
  },
};

export default CameraIcon;
