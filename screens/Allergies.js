import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AddButton from './components/addbutton';
import DeleteButton from './components/deletebutton';
import Input from './components/Input'; // Önceden oluşturduğun Input component
import Title from './components/Title';
import Checkbox from './components/CheckBox';

const App = () => {
  const [allergies, setAllergies] = useState(['Alerji 1', 'Alerji 2']); // Başlangıç alerjileri
  const [newAllergy, setNewAllergy] = useState('');
  const [checkedAllergies, setCheckedAllergies] = useState(Array(allergies.length).fill(false));

  const handleAddAllergy = () => {
    if (newAllergy) {
      setAllergies([...allergies, newAllergy]);
      setCheckedAllergies([...checkedAllergies, false]); // Yeni alerji için checkbox durumu ekle
      setNewAllergy(''); // Girdiyi sıfırla
    }
  };

  const toggleCheckbox = (index) => {
    const updatedCheckedAllergies = [...checkedAllergies];
    updatedCheckedAllergies[index] = !updatedCheckedAllergies[index];
    setCheckedAllergies(updatedCheckedAllergies);
  };

  const handleDeleteAll = () => {
    setCheckedAllergies(Array(allergies.length).fill(false)); // Tüm checkbox'ları sıfırla
  };

  return (
    <View style={styles.container}>
      
      <Title text={"Alerjilerim"}/>

      <View style={styles.inputContainer}>
        <Input 
          title="Yeni Alerji Ekle" 
          value={newAllergy} 
          onChangeText={setNewAllergy} 
        />
        <AddButton title="Alerji Ekle" onPress={handleAddAllergy} />
        <DeleteButton title="Hepsini Sil" onPress={handleDeleteAll} />
        
      </View>
      
      <View style={styles.allergyContainer}  >
        {allergies.map((allergy, index) => (
          <Checkbox 
            key={index}
            isChecked={checkedAllergies[index]}
            onToggle={() => toggleCheckbox(index)}
            label={allergy} // Checkbox yanında gösterilecek metin
          />
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
    alignItems:'flex-start',
    marginBottom:20,
    alignContent:'space-between',
    flexWrap:'wrap',
    padding:15,
    justifyContent:'space-between',
    
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

export default App;
