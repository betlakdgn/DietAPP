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
      setLoading(true);

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

    process();
  }, [photoUri, scannedIngredients]);

  return { loading, matchedAllergies, isAllergySafe, ocrText };
};
