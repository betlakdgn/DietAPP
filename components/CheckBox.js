
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Checkbox = ({ isChecked, onToggle, label }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}  >
      <View style={[styles.checkbox, isChecked && styles.checked]}>
       {isChecked && <Text style={styles.checkmark}>✓</Text>} 
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    flexWrap:'wrap',
    
    
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 3,
    marginRight: 10,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'white',
    
  },
  checked: {
    backgroundColor: '#4CAF50',
  },
  checkmark:{
    color:'white',
    fontSize:16,
  },
  label: {
    fontSize: 18,
  },
});

export default Checkbox;
