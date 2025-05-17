import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export const getUserSelectedAllergies = async () => {
  if (!auth.currentUser) return [];

  const userDocRef = doc(db, 'users', auth.currentUser.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) return [];

  return userDocSnap.data().selectedAllergies || [];
};
