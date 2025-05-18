import { useAlert } from './CustomAlertContext';


let showAlertRef = null;

export const setShowAlert = (fn) => {
  showAlertRef = fn;
};

export const alert = (title, message, buttons) => {
  if (showAlertRef) {
    showAlertRef({ title, message, buttons });
  } else {
    console.warn('Alert sistemi hazır değil!');
  }
};
