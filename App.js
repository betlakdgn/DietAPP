import React from 'react';
import Navigation from './navigation/Navigation'; 
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {RootSiblingParent} from 'react-native-root-siblings';
import { AlertProvider } from './components/CustomAlertContext';


const App = () => {
  return (
    <AlertProvider>
      <RootSiblingParent>
        <Navigation />
      </RootSiblingParent>
    </AlertProvider>
  );
};

export default App;
