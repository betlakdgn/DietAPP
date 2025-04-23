import React, { useState, useEffect } from 'react';
import { View, Text, FlatList,ImageBackground, Image, StyleSheet, TouchableOpacity, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDocs, collection, query, where } from 'firebase/firestore'; 
import { db, auth} from '../firebase';
import backg from '../assets/backg.jpg';

const Saved = () => {
  const navigation = useNavigation();
  const [savedPhotos, setSavedPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const userId = auth.currentUser.uid;
        const q = query(
          collection(db, 'savedPhotos'),
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const photos = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          photos.push({
            photoUri: data.photoUri,
            photoName: data.photoName || 'İsimsiz',
          });
        });
        setSavedPhotos(photos);
      } catch (error) {
        console.error('Fotoğraflar alınırken hata oluştu:', error);
      }
    };
  
    fetchPhotos();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.photoContainer}
      onPress={() => navigation.navigate("SavedDetails", {photo:item})}
    >
      <Image source={{ uri: item.photoUri }} style={styles.photo} />
      <Text style={styles.photoName}>{item.photoName}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={backg} style ={styles.backgroundcontainer}>
      <View style={styles.overlay}></View>

        <View style={styles.container}>
          <Text style={styles.title}>Kaydedilen Fotoğraflar</Text>
          {savedPhotos.length === 0 ? (
            <Text style={styles.noPhotosText}>Henüz kaydedilen fotoğraf yok.</Text>
          ) : (
            <FlatList
              data={savedPhotos}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.photoList}
            />
          )}
          
        </View>
    </ImageBackground>
    
  
  );
};

const styles = StyleSheet.create({
  backgroundcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
  },
  container: {
    flex: 1,
    paddingVertical:80,
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
  },
  photoContainer: {
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
  },
  
});

export default Saved;
