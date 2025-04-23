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
        placeholderTextColor="#A9A9A9"
      />
      {onIconPress && (
        <TouchableOpacity onPress={onIconPress} style={styles.iconContainer}>
          <Ionicons name="search" size={25} color= "#A9A9A9" />
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
    width: '90%',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    height: 50,
    width:'100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
  },
  iconContainer: {
    marginLeft:10,
  },
});

export default TextInputComponent;
