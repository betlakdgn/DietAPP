import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Allergies from '../screens/Allergies';
import Profile from '../screens/Profile';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Allergies">
        <Stack.Screen 
          name="Allergies" 
          component={Allergies} 
        />
        <Stack.Screen 
          name="Profile" 
          component={Profile} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
