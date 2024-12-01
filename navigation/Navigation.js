import React, {useEffect, useState} from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Allergies from '../screens/Allergies';
import Profile from '../screens/Profile';
import MainLoginPage from '../screens/MainLoginPage';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import MainScreen from '../screens/MainScreen';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from '../firebase';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Kullanıcı giriş yaptı
        setUser(currentUser);
      } else {
        // Kullanıcı çıkış yaptı veya hiç giriş yapmadı
        setUser(null);
      }
      setLoading(false); // Kontrol tamamlandı
    });
    return unsubscribe; // Cleanup listener
  }, []);

  if (loading) {
    // Giriş durumu kontrol edilirken yükleniyor göstergesi
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen">
        {user ? (
          <>
            <Stack.Screen name="Allergies" component={Allergies} />
            <Stack.Screen name="Profile" component={Profile} />
          
          </>
        ) : (
          <>
            <Stack.Screen name="MainLoginPage" component={MainLoginPage} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="MainScreen" component={MainScreen} />
            
          
          </>
        )}
          
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
