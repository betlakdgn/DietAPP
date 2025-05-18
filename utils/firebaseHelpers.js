import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';

export const savePhotoWithData = async ({ photoUri, photoName, matchedAllergies, isAllergySafe, nutritionData, healthScore }) => {
  try {
    const docRef = await addDoc(collection(db, 'savedPhotos'), {
      photoUri,
      photoName,
      matchedAllergies,
      isAllergySafe,
      nutritionData,
      healthScore, 
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving photo:', error);
    throw error;
  }
};