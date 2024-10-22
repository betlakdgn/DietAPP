import React from 'react';
import { View, StyleSheet } from 'react-native';

const IconFrame = ({ iconName, size = 30, color = '#fff' }) => {
  return (
    <View style={styles.iconContainer}>
      <Icon name={iconName} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#4CAF50',  // İkon çerçevesi rengi
    width: 60,                   // Yuvarlak çerçeve genişliği
    height: 60,                  // Yuvarlak çerçeve yüksekliği
    borderRadius: 30,            // Yuvarlak yapma
    justifyContent: 'center',    // Dikeyde ortalama
    alignItems: 'center',        // Yatayda ortalama
    marginBottom: 10,            // İkon ve buton arasındaki boşluk
    shadowColor: '#000',         // Gölge rengi
    shadowOffset: { width: 0, height: 4 }, // Gölge pozisyonu
    shadowOpacity: 0.3,          // Gölge opaklığı
    shadowRadius: 4,             // Gölge yarıçapı
    elevation: 8,                // Android için gölge
  },
});

export default IconFrame;

