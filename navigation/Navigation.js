import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Allergies from '../screens/Allergies';
import Profile from '../screens/Profile';
import MainLoginPage from '../screens/MainLoginPage';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import MainScreen from '../screens/MainScreen';
import PhotoPreview from '../screens/PhotoPreview';
import CameraScreen from '../screens/CameraScreen';
import ProfileSettings from '../screens/ProfileSettings';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const Stack = createNativeStackNavigator();

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
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainScreen"
        screenOptions={{
          headerShown: false, // Başlık çubuğunu gizler
          gestureEnabled: true, // Kaydırarak geçiş yapılabilir
          gestureDirection: 'horizontal', // Yatay kaydırma yönü
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 500 } },
            close: { animation: 'timing', config: { duration: 500 } },
          },
          cardStyleInterpolator: ({ current, next }) => {
            const translateX = current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [300, 0], // Ekranın sağ tarafından sola kayma
            });
            return {
              cardStyle: {
                transform: [
                  {
                    translateX,
                  },
                ],
              },
            };
          },
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="MainScreen" component={MainScreen} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Allergies" component={Allergies} />
            <Stack.Screen name="PhotoPreview" component={PhotoPreview} /> 
            <Stack.Screen name="CameraScreen" component={CameraScreen} />
            <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainLoginPage" component={MainLoginPage} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="MainScreen" component={MainScreen} />
            <Stack.Screen name="PhotoPreview" component={PhotoPreview} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
