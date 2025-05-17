import { getFoodAllergenMap } from './allergensData';

export const cleanText = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9\sçğıüöş]/g, '').trim();
};

export const findMatchedAllergies = (text) => {
  const cleanedText = cleanText(text);
  const allergenMap = getFoodAllergenMap();

  const matchedFoods = Object.keys(allergenMap).filter(food =>
    cleanedText.includes(food)
  );

  return matchedFoods.map(food => allergenMap[food]).filter(Boolean);
};
