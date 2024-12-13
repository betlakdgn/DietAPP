import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// Kullanıcıyı Firestore'a kaydeden fonksiyon
export const createUser = async (userId, userData) => {
  try {
    await setDoc(doc(db, "users", userId), userData);
    console.log("Kullanıcı başarıyla kaydedildi");
  } catch (error) {
    console.error("Veri eklenirken hata oluştu", error);
  }
};
