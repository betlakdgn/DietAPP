import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import EyeIcon from './EyeIcon';  
import {Ionicons} from "@expo/vector-icons";

const TextInputComponent = ({ placeholder, secureTextEntry, value, onChangeText, onIconPress }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState); 
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry && !isPasswordVisible} 
        value={value}
        onChangeText={onChangeText}
      />
      {onIconPress && (
        <TouchableOpacity onPress={onIconPress} style={styles.iconContainer}>
          <Ionicons name="search" size={20} color= "black" />
        </TouchableOpacity>
      )}
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
  iconContainer: {
    
  },
});

export default TextInputComponent;
