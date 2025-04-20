import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';

const Checkbox = ({ isChecked, onToggle, label }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}  >
      <View style={[styles.checkbox, isChecked && styles.checked]}>
       {isChecked && <MaterialIcons name="check" size={15} color="white" />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFB6C1', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    
  },
  checked: {
    backgroundColor: '#FFB6C1',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});

export default Checkbox;
