import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const savePhotoWithData = async ({ photoUri, photoName, matchedAllergies, isAllergySafe, nutritionData, healthScore }) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Kullanıcı oturumu yok");
    
    const dataToSave = {
      userId: currentUser.uid,
      photoUri,
      photoName,
      matchedAllergies,
      isAllergySafe,
      healthScore,
      createdAt: new Date(),
    };

    if (nutritionData !== undefined) {
      dataToSave.nutritionData = nutritionData;
    }

    const docRef = await addDoc(collection(db, 'savedPhotos'), dataToSave);
    return docRef.id;
  } catch (error) {
    console.error('Error saving photo:', error);
    throw error;
  }
};
