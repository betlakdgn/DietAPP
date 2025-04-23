import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SavePhotoModal = ({ visible, onClose, onSave }) => {
  const [photoName, setPhotoName] = useState('');

  const handleSave = () => {
    onSave(photoName);
    setPhotoName('');
    onClose();
  };
  const handleClose = () => {
    setPhotoName('');
    onClose();
  };
  
  

  return (
    <Modal transparent={true} visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Fotoğraf için bir isim belirle</Text>
          <TextInput
            style={styles.input}
            placeholder="Fotoğraf ismi"
            value={photoName}
            onChangeText={setPhotoName}
          />
          <TouchableOpacity style={styles.saveButtonModal} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.buttonText} >Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  saveButtonModal: {
    backgroundColor: '#ffb6c1',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#ffb6c1',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SavePhotoModal;