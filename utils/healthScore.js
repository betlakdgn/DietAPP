export function calculateHealthScore(nutrition) {
  let score = 100;
  if (!nutrition) return 0; 
  if (nutrition.fat > 17.5) score -= 15;
  if (nutrition.sugars > 22.5) score -= 20;
  if (nutrition.salt > 1.5) score -= 15;
  if (nutrition.fiber < 1.5) score -= 10;
  if (nutrition.energy > 500) score -= 10;
  return Math.max(0, Math.min(100, score));
}
