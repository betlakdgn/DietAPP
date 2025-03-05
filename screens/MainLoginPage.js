import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ButtonComponent from '../components/ButtonComponent'; 
import IconFrame from '../components/IconFrame';
import { ImageBackground } from 'react-native';
import background from '../assets/backgroun.jpg';

const MainLoginPage = () => {
  const navigation = useNavigation(); 
  
 
  return (
    <ImageBackground source={background} style ={styles.backgroundcontainer}>
      <View style={styles.overlay}></View>
      
        <View style={styles.iconFrameContainer}>
          <IconFrame imageSource={require('../assets/myIcon.png')} />
        </View>
        
        <View style={styles.buttonContainer}>
          
          <ButtonComponent title="Login"  onPress={()=> navigation.navigate("Login")} />   
          <ButtonComponent title="Sign Up"   onPress={()=> navigation.navigate("SignUp")}/>
        </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  iconFrameContainer: {
    marginBottom:50,
    alignItems:'center',
    justifyContent:'center',

  },
  buttonContainer: {
    width: '80%',               
  },

});

export default MainLoginPage;
