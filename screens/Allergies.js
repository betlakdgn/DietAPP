import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, ScrollView, Animated, Keyboard } from 'react-native';
import AddButton from '../components/addbutton';
import Input from '../components/Input'; 
import Title from '../components/Title';
import Checkbox from '../components/CheckBox';
import BackButton from '../components/BackButton';
import DangerButton from '../components/DangerButton';
import {db, auth} from '../firebase';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import foodAllergens from '../data/food_allergens.json';
import { ImageBackground } from 'react-native';
import backg from '../assets/backg.jpg';



const Allergies= () => {
  const [allergies, setAllergies] = useState([]); 
  const [newAllergy, setNewAllergy] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const scrollViewRef = useRef(null);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current; 

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
  
        let userAllergies = [];
        let selectedAllergies = [];
  
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          userAllergies = data.allergies || [];
          selectedAllergies = data.selectedAllergies || [];
        }
  
        const defaultAllergies = [
          ...new Set(
            foodAllergens
              .map((item) => item.Allergy)
              .filter(Boolean) 
          ),
        ];
  
        // Varsayılan alerjilerle kullanıcının mevcut alerjilerini birleştir
        const combinedAllergies = [...new Set([...userAllergies, ...defaultAllergies])];
  
        setAllergies(combinedAllergies);
        setSelectedAllergies(combinedAllergies.filter(allergy => selectedAllergies.includes(allergy)));
  
        // Varsayılan alerjileri Firebase'e ekleyerek kalıcı hale getir
        if (userDocSnap.exists()) {
          await updateDoc(userDocRef, {
            allergies: combinedAllergies,
            selectedAllergies: selectedAllergies,
          });
        } else {
          await updateDoc(userDocRef, {
            allergies: combinedAllergies,
            selectedAllergies: selectedAllergies,
          });
        }
      } catch (error) {
        console.error("Error fetching allergies: ", error);
      }
    };
  
    fetchAllergies();
  }, []);
  

  const startBlinkingOnce = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setHighlightIndex(null)); 
  };

  const handleSearch = () => {
    Keyboard.dismiss();

    const index = allergies.findIndex((allergy) =>
      allergy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (index >= 0 && scrollViewRef.current) {
      setHighlightIndex(index);
      scrollViewRef.current.scrollTo({ y: index * 20, animated: true });
      startBlinkingOnce();
    } else {
      Alert.alert("Sonuç Yok", "Aramanızla eşleşen bir alerji bulunamadı.");
    }
  };  
  
  const handleAddAllergy = async () => {
    if (newAllergy) {
      
      const updatedAllergies = [...allergies, newAllergy];
      const updatedCheckedAllergies = [...checkedAllergies, false];

      setAllergies(updatedAllergies);
      setCheckedAllergies(updatedCheckedAllergies);
      setNewAllergy('');

      
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDocRef, {
          allergies: updatedAllergies,
          selectedAllergies: selectedAllergies
        });
      } catch (error) {
        console.error("Alerji eklerken hata oluştu: ", error);
      }
    }
  };

  const toggleCheckbox = async (index) => {
    const updatedSelectedAllergies = [...selectedAllergies];
    const allergy = allergies[index];
  
    if (updatedSelectedAllergies.includes(allergy)) {
      updatedSelectedAllergies.splice(updatedSelectedAllergies.indexOf(allergy), 1);
    } else {
      updatedSelectedAllergies.push(allergy);
    }
  
    setSelectedAllergies(updatedSelectedAllergies);
  
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      
      await updateDoc(userDocRef, {
        selectedAllergies: updatedSelectedAllergies,
      });
    } catch (error) {
      console.error("Error updating checkbox state: ", error);
    }
  };
  

  const handleDeleteAll = async () => {
    setSelectedAllergies([]);
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid); 
      await updateDoc(userDocRef, {
        allergies: [], 
        selectedAllergies: [],
      });
    } catch (error) {
      console.error("Error deleting allergies: ", error);
      Alert.alert("Hata", "Alerjiler silinemedi.");
    }
  };

  return (
    <ImageBackground source={backg} style ={styles.backgroundcontainer}>
      <View style={styles.overlay}></View>
     
        <BackButton targetScreen="Profile" />
        <Title text={"Alerjilerim"}/>
        

        <View style={styles.inputContainer}>
          <Input 
            value={searchTerm} 
            onChangeText={setSearchTerm} 
            onIconPress={handleSearch}
          />
        </View>
        <View style={styles.buttonContainer}>
        <AddButton title="Alerji Ekle" onPress={handleAddAllergy} />
        <DangerButton title="Hepsini Sil" onPress={handleDeleteAll} />
        </View>
        
        <ScrollView style={styles.scrollView} ref={scrollViewRef}>
          <View style={styles.allergyContainer}  >
            {allergies.map((allergy, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.checkboxWrapper,
                  index === highlightIndex && { opacity: fadeAnim }, 
                ]}
              >
                <Checkbox
                  isChecked={selectedAllergies.includes(allergy)} 
                  onToggle={() => toggleCheckbox(index)} 
                  label={allergy} 
                />
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      
      

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
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },
  allergyContainer: {
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent:'space-between',
    padding:15,
    
  },
  checkboxWrapper: {
    width:'48%',
    marginBottom:15,
  },
  buttonContainer:{
    flexDirection: 'row',
    justifyContent:'space-between',
    width :'60%',
    marginTop: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent:'space-around',
    paddingHorizontal:10,
    width:'100%',
    
  },
  scrollView:{
    flex:1,
    width:'100%',
  },

});

export default Allergies;
