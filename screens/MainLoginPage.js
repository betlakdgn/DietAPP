import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ButtonComponent from '../components/ButtonComponent'; 
import IconFrame from '../components/IconFrame';


const MainLoginPage = () => {
  const navigation = useNavigation(); 
  
 
  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.iconFrameContainer}>
        <IconFrame imageSource={require('../assets/myIcon.png')} />
      </View>
      
      <View style={styles.buttonContainer}>
        
        <ButtonComponent title="Login"  onPress={()=> navigation.navigate("Login")} />   
        <ButtonComponent title="Sign Up"   onPress={()=> navigation.navigate("SignUp")}/>
        <ButtonComponent  onPress={() => alert('Null button pressed!')} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',      
    
    
  },
  iconFrameContainer: {
    marginBottom:50,
    alignItems:'center',

  },
  buttonContainer: {
    width: '80%',               
  },

});

export default MainLoginPage;
