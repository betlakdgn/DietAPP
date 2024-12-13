import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AddButton from '../components/addbutton';
import Input from '../components/Input'; 
import Title from '../components/Title';
import Checkbox from '../components/CheckBox';
import BackButton from '../components/BackButton';
import DangerButton from '../components/DangerButton';
import {db, auth} from '../firebase';
import {doc, getDoc, updateDoc} from 'firebase/firestore';


const Allergies= () => {
  const [allergies, setAllergies] = useState(['Alerji 1', 'Alerji 2']); 
  const [newAllergy, setNewAllergy] = useState('');
  const [checkedAllergies, setCheckedAllergies] = useState([]);

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setAllergies(data.allergies || []);
          setCheckedAllergies(data.checkedAllergies || []);
        }
      } catch (error) {
        console.error("Error fetching allergies: ", error);
      }
    };
    fetchAllergies();
  }, []);

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
          checkedAllergies: updatedCheckedAllergies,
        });
      } catch (error) {
        console.error("Error adding allergies: ", error);
      }
    }
  };

  const toggleCheckbox = async (index) => {
    const updatedCheckedAllergies = [...checkedAllergies];
    updatedCheckedAllergies[index] = !updatedCheckedAllergies[index];
    
    setCheckedAllergies(updatedCheckedAllergies);

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        checkedAllergies: updatedCheckedAllergies,
      });
    } catch (error) {
      console.error("Error updating checkbox state: ", error);
    }
  };

  const handleDeleteAll = async () => {
    setCheckedAllergies(Array(allergies.length).fill(false));
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid); 
      await updateDoc(userDocRef, {
        allergies: [], 
      });
    } catch (error) {
      console.error("Error deleting allergies: ", error);
      Alert.alert("Hata", "Alerjiler silinemedi.");
    }
  };

  return (
    <View style={styles.container}>
     
      <BackButton targetScreen="Profile" />
      <Title text={"Alerjilerim"}/>
     

      <View style={styles.inputContainer}>
        <Input 
          title="Yeni Alerji Ekle" 
          value={newAllergy} 
          onChangeText={setNewAllergy} 
        />
        <AddButton title="Alerji Ekle" onPress={handleAddAllergy} />
        <DangerButton title="Hepsini Sil" onPress={handleDeleteAll} />
        
      </View>
      
      <View style={styles.allergyContainer}  >
        {allergies.map((allergy, index) => (
         <View key={index} style={styles.checkboxWrapper}>
          <Checkbox 
            
            isChecked={checkedAllergies[index]}
            onToggle={() => toggleCheckbox(index)}
            label={allergy} 
          />
         </View>
        ))}
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent:'space-around',
    paddingHorizontal:10,
    width:'100%',
    
  },
  

});

export default Allergies;
