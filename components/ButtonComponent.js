

import React, {useState} from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ButtonComponent = ({ title, onPress }) => {
    const [isPressed, setIsPressed] = useState(false); 
    
    return (
      <TouchableOpacity
        style={styles.button}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)} 
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
    backgroundColor: '#4CAF50',  
    paddingVertical: 15,       
    paddingHorizontal: 30,       
    borderRadius: 10,            
    marginVertical: 10,          
    alignItems: 'center',        
  },
  buttonText: {
    color: 'white',              
    fontSize: 18,                
    paddingBottom:3
  },
  pressedText:{
    fontWeight:'bold',
    color:'grey',
    
    
  },
});

export default ButtonComponent;
