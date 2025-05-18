import { useState, useEffect } from 'react';
import { performOcr } from '../utils/ocr';
import { translateText } from '../utils/translate';
import { findMatchedAllergies } from '../utils/allergyMatcher';
import { getUserSelectedAllergies } from '../utils/userAllergies';

export const usePhotoProcessing = (photoUri, scannedIngredients) => {
  const [loading, setLoading] = useState(true);
  const [matchedAllergies, setMatchedAllergies] = useState([]);
  const [isAllergySafe, setIsAllergySafe] = useState(null);
  const [ocrText, setOcrText] = useState('');

  useEffect(() => {
    const process = async () => {
      //console.log('Processing started:', { photoUri, scannedIngredients });

      if (!photoUri && !scannedIngredients) {
        console.log('No data to process');
        setLoading(false);
        return;
      }

      if (scannedIngredients?.toLowerCase().includes("içindekiler bilgisi yok")) {
        setMatchedAllergies([]);
        setIsAllergySafe(true);
        setLoading(false);
        return;
      }

      if (!photoUri && scannedIngredients) {
        setOcrText(scannedIngredients);
        const userAllergies = await getUserSelectedAllergies();
        const allergies = findMatchedAllergies(scannedIngredients);
        const matchedUserAllergies = allergies.filter(a => userAllergies.includes(a));

        setMatchedAllergies(allergies);
        setIsAllergySafe(matchedUserAllergies.length === 0);
        setLoading(false);
        return;
      }

      if (!photoUri) {
        setLoading(false);
        return;
      }

      let text = scannedIngredients || '';

      if (!text && photoUri) {
        const ocrResult = await performOcr(photoUri);
        setOcrText(ocrResult);
        text = ocrResult;
      }

      const translated = await translateText(text);
      if (!translated) {
        setMatchedAllergies([]);
        setIsAllergySafe(true);
        setLoading(false);
        return;
      }

      const allergies = findMatchedAllergies(translated);
      const userAllergies = await getUserSelectedAllergies();
      const matchedUserAllergies = allergies.filter(a => userAllergies.includes(a));
      
      setMatchedAllergies(allergies);
      setIsAllergySafe(matchedUserAllergies.length === 0);
      setLoading(false);
    };

    process().catch(err => {
      console.error('Error in process:', err);
      setLoading(false);
    });
  }, [photoUri, scannedIngredients]);


  return { loading, matchedAllergies, isAllergySafe, ocrText };
};
