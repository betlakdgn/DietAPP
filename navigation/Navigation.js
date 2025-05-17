import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import Allergies from '../screens/Allergies';
import Profile from '../screens/Profile';
import MainLoginPage from '../screens/MainLoginPage';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import PhotoPreview from '../screens/PhotoPreview';
import CameraScreen from '../screens/CameraScreen';
import ProfileSettings from '../screens/ProfileSettings';
import Saved from '../screens/Saved';
import SavedDetails from '../screens/SavedDetails';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const Stack = createStackNavigator();


const Navigation = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false); 
    });
    return unsubscribe; 
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer >
      <Stack.Navigator
        initialRouteName="CameraScreen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 400 } },
            close: { animation: 'timing', config: { duration: 400 } },
          },
        }}
      >
        
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="PhotoPreview" component={PhotoPreview} />
        {user ? (
          <>
            
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Allergies" component={Allergies} />
            <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
            <Stack.Screen name="Saved" component={Saved} />
            <Stack.Screen name="SavedDetails" component={SavedDetails} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainLoginPage" component={MainLoginPage} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
