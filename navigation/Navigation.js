import React, {useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Allergies from '../screens/Allergies';
import Profile from '../screens/Profile';
import MainLoginPage from '../screens/MainLoginPage';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import MainScreen from '../screens/MainScreen';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen">
        <Stack.Screen 
          name="Allergies" 
          component={Allergies} 
        />
        <Stack.Screen 
          name="Profile" 
          component={Profile} 
        />
        <Stack.Screen
          name="MainLoginPage"
          component={MainLoginPage}
        />
        <Stack.Screen
          name="Login"
          component={Login}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
        />
        
          
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
