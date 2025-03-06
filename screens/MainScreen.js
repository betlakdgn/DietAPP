import React from 'react';
import { View, StyleSheet } from 'react-native';
import CameraScreen from './CameraScreen';  
import BottomButtons from '../components/BottomButtons'; 
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

const MainScreen = ({ navigation }) => {
  const handleGesture = ({ nativeEvent }) => {
    if (nativeEvent.translationX > 100) {  
      navigation.navigate('Profile');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={handleGesture}>
        <View style={styles.container}>
          <CameraScreen /> 
          <BottomButtons />
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MainScreen;
