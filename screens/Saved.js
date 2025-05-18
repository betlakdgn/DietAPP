import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity,ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDocs, collection, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import backg from '../assets/backg.jpg';
import { MaterialIcons } from '@expo/vector-icons'; // delete icon için
import {alert} from '../components/alertService';

const Saved = () => {
  const navigation = useNavigation();
  const [savedPhotos, setSavedPhotos] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());

  const fetchPhotos = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setSavedPhotos([]);
        return;
      }
      const userId = currentUser.uid;
      const q = query(collection(db, 'savedPhotos'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const photos = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        photos.push({
          id: doc.id,
          photoUri: data.photoUri,
          photoName: data.photoName || 'İsimsiz',
        });
      });
      setSavedPhotos(photos);
    } catch (error) {
      console.error('Fotoğraflar alınırken hata oluştu:', error);
      setSavedPhotos([]);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPhotos();
      clearSelection();
    });
    return unsubscribe;
  }, [navigation]);

  const clearSelection = () => {
    setSelectionMode(false);
    setSelectedPhotos(new Set());
  };

  const toggleSelection = (id) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(id)) {
      newSelected.delete(id);
      if (newSelected.size === 0) {
        setSelectionMode(false);
      }
    } else {
      newSelected.add(id);
      setSelectionMode(true);
    }
    setSelectedPhotos(newSelected);
  };

  const handleLongPress = (id) => {
    if (!selectionMode) {
      toggleSelection(id);
    }
  };

  const handlePress = (item) => {
    if (selectionMode) {
      toggleSelection(item.id);
    } else {
      navigation.navigate("SavedDetails", { photo: item });
    }
  };

  const deleteSelectedPhotos = () => {
    alert(
      'Silmek istediğinize emin misiniz?',
      `${selectedPhotos.size} fotoğraf silinecek.`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              for (const id of selectedPhotos) {
                await deleteDoc(doc(db, 'savedPhotos', id));
              }
              await fetchPhotos();
              clearSelection();
            } catch (error) {
              console.error('Fotoğraf silme hatası:', error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedPhotos.has(item.id);
    return (
      <TouchableOpacity
        style={[styles.photoContainer, isSelected && styles.selectedPhotoContainer]}
        onPress={() => handlePress(item)}
        onLongPress={() => handleLongPress(item.id)}
      >
        <Image source={{ uri: item.photoUri }} style={styles.photo} />
        <Text style={styles.photoName}>{item.photoName}</Text>
        {selectionMode && (
          <View style={styles.checkbox}>
            {isSelected ? (
              <MaterialIcons name="check-box" size={24} color="#white" />
            ) : (
              <MaterialIcons name="check-box-outline-blank" size={24} color="#black" />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={backg} style={styles.backgroundcontainer}>
        <View style={styles.overlay} />

        {selectionMode && (
          <View style={styles.deleteBar}>
            <TouchableOpacity onPress={deleteSelectedPhotos} style={styles.deleteButton}>
              <MaterialIcons name="delete" size={28} color="black" />
              <Text style={styles.deleteText}>Sil ({selectedPhotos.size})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearSelection} style={styles.cancelButton}>
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.container}>
          <Text style={styles.title}>Kaydedilen Fotoğraflar</Text>
          {savedPhotos.length === 0 ? (
            <Text style={styles.noPhotosText}>Henüz kaydedilen fotoğraf yok.</Text>
          ) : (
            <FlatList
              data={savedPhotos}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.photoList}
            />
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundcontainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  container: {
    flex: 1,
    paddingVertical: 80,
    paddingHorizontal:20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  noPhotosText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    fontWeight: 'bold',
  },
  photoList: {
    paddingBottom: 100,
    paddingHorizontal:0,
  },
  photoContainer: {
    width: '100%',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffb6cc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    opacity: 0.8,
    position: 'relative',
  },
  selectedPhotoContainer: {
    borderColor: '#black',
    borderWidth: 2,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'cover',
  },
  photoName: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    flex: 1,
  },
  checkbox: {
    marginLeft: 10,
  },
  deleteBar: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#ffb6c1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteText: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  cancelButton: {
    paddingHorizontal: 10,
  },
  cancelText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Saved;
