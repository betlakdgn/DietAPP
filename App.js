import React from 'react';

import { SafeAreaView, View, StyleSheet } from 'react-native';
import ButtonComponent from './components/LogButtons'; // Buton bileşenini import et

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        
        <ButtonComponent title="Login" onPress={() => alert('Login pressed!')} />

        
        <ButtonComponent title="Sign Up" onPress={() => alert('Sign Up pressed!')} />

       
        <ButtonComponent title="" onPress={() => alert('Null button pressed!')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Dikeyde ortalama
    alignItems: 'center',      // Yatayda ortalama
    backgroundColor: '#f5f5f5', // Arka plan rengi
  },
  buttonContainer: {
    width: '80%',               // Butonların genişliği ekranın %80'i kadar
  },

});

export default App;
