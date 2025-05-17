import React from 'react';
import Navigation from './navigation/Navigation'; 
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {RootSiblingParent} from 'react-native-root-siblings';


const App = () => {
  return (
    <RootSiblingParent>
      <Navigation />
    </RootSiblingParent>
      
    
  );
};

export default App;
