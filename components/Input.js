import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import EyeIcon from './EyeIcon';  // EyeIcon bileşenini içeri aktar

const TextInputComponent = ({ placeholder, secureTextEntry, value, onChangeText }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState); // Şifreyi göster/gizle
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry && !isPasswordVisible} // Eğer secureTextEntry varsa, gizler
        value={value}
        onChangeText={onChangeText}
      />
      {secureTextEntry && (
        <EyeIcon
          onPress={togglePasswordVisibility}
          isSecure={isPasswordVisible}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
    marginVertical: 10,
  },
  input: {
    flex: 1, // TextInput alanını mümkün olduğunca genişlet
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default TextInputComponent;
