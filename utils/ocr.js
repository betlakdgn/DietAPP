import * as FileSystem from 'expo-file-system'; 
import * as ImageManipulator from 'expo-image-manipulator';
import {OCR_API_KEY} from '@env';

const OCR_URL = 'https://api.ocr.space/parse/image';

export const performOcr = async (photoUri) => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      photoUri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    const base64Image = await FileSystem.readAsStringAsync(manipResult.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const base64ImageWithType = `data:image/jpeg;base64,${base64Image}`;

    const response = await fetch(OCR_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `apikey=${OCR_API_KEY}&base64Image=${encodeURIComponent(base64ImageWithType)}`,
    });

    const result = await response.json();

    if (result?.ParsedResults?.length > 0) {
      return result.ParsedResults[0]?.ParsedText || '';
    }
    return '';
  } catch (error) {
    console.error('OCR error:', error);
    return '';
  }
};
