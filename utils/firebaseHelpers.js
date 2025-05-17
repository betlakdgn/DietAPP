import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export const savePhotoWithData = async ({ photoUri, photoName, matchedAllergies, isAllergySafe }) => {
  if (!auth.currentUser) throw new Error('User not authenticated.');

  const userId = auth.currentUser.uid;
  const docRef = doc(db, 'savedPhotos', `${userId}_${Date.now()}`);

  await setDoc(docRef, {
    userId,
    photoName,
    photoUri,
    matchedAllergies,
    isAllergySafe,
    createdAt: new Date().toISOString(),
  });
};
