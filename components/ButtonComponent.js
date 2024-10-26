

import React, {useState} from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ButtonComponent = ({ title, onPress }) => {
    const [isPressed, setIsPressed] = useState(false); // Basılı mı kontrolü
    
    return (
      <TouchableOpacity
        style={styles.button}
        onPressIn={() => setIsPressed(true)}  // Butona basıldığında tetiklenir
        onPressOut={() => setIsPressed(false)} // Butondan el çekildiğinde tetiklenir
        onPress={onPress}
      >
        <Text style={[styles.buttonText, isPressed && styles.pressedText]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',  // Buton rengi
    paddingVertical: 15,         // Dikey padding (buton yüksekliği)
    paddingHorizontal: 30,       // Yatay padding (buton genişliği)
    borderRadius: 10,            // Yuvarlatılmış köşeler
    marginVertical: 10,          // Dikey boşluk
    alignItems: 'center',        // Metni ortalama
  },
  buttonText: {
    color: 'white',              // Metin rengi
    fontSize: 18,                // Metin boyutu
    paddingBottom:3
  },
  pressedText:{
    fontWeight:'bold',
    color:'grey',
    
    
  },
});

export default ButtonComponent;
