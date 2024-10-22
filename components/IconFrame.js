import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const IconFrame = ({ imageSource }) => {
  return (
    <View style={styles.iconContainer}>
      <Image source={imageSource} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#fbcfe8',     // Çerçevenin arka plan rengi
    width: 105,                  // Çerçevenin genişliği
    height: 105,                 // Çerçevenin yüksekliği
    borderRadius: 50,            // Tam yuvarlak yapmak için yarıçapı yarıya ayarlarız
    justifyContent: 'center',    // Dikeyde ortalama
    alignItems: 'center',        // Yatayda ortalama
    shadowColor: '#ec4899',         // Gölge rengi
    shadowOffset: { width: 0, height: 4 }, // Gölge konumu
    shadowOpacity: 0.1,          // Gölge opaklığı
    shadowRadius: 45,             // Gölge büyüklüğü
    elevation: 10,               // Android gölgelendirme
  },
  icon: {
    marginVertical: 568,
    width: 100,                   // İkonun genişliği
    height: 100,                  // İkonun yüksekliği
    borderRadius: 40,            // İkonun yuvarlak olması
  },
});

export default IconFrame;
