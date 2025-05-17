import foodAllergens from '../data/food_allergens.json';

export const getFoodAllergenMap = () => {
  return foodAllergens.reduce((acc, item) => {
    acc[item.Food.toLowerCase()] = item.Allergy;
    return acc;
  }, {});
};
