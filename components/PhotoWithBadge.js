import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const PhotoWithBadge = ({ isAllergySafe }) => {
  const text = isAllergySafe ? 'Uygun' : 'Uygun Değil';
  const color = isAllergySafe ? 'green' : 'red';

  return (
    <Animatable.View
      animation="pulse"
      duration={1500}
      style={[
        styles.badgeContainer,
        { borderColor: color }
      ]}
    >
      <Text style={[styles.badgeText, { color }]}>{text}</Text>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    top: '30%',
    left: '30%',
    transform: [{ translateX: -75 }],
    width: 160,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 4,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,
  },
  badgeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default PhotoWithBadge;
