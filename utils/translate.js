import { GOOGLE_TRANSLATE_API_KEY} from '@env';

export const translateText = async (text, targetLang = 'en') => {
  if (!text) return '';

  const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, target: targetLang }),
    });

    const json = await response.json();

    return json?.data?.translations?.[0]?.translatedText || '';
  } catch (error) {
    console.error('Translate error:', error);
    return '';
  }
};
