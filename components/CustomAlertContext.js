import React, { createContext, useState, useContext, useEffect } from 'react';
import CustomAlert from './CustomAlert';
import { setShowAlert } from './alertService';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  const showAlert = ({ title, message, buttons }) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      buttons: (buttons && buttons.length > 0) ? buttons.map(btn => ({
        ...btn,
        onPress: () => {
          btn.onPress?.();
          hideAlert();
        },
      })) : [
        {
          text: 'Tamam',
          onPress: hideAlert,
          style: { backgroundColor: '#ffb6c1' },
          textStyle: { color: 'white' },
        },
      ],
    });
  };

 
  useEffect(() => {
    setShowAlert(showAlert);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
