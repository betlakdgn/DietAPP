import { useState } from 'react';
import Toast from 'react-native-root-toast';
import { Alert } from 'react-native';

export const useBarcodeScanner = (navigation) => {
  const [scanned, setScanned] = useState(false);

  const fetchProductData = async (barcode) => {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const json = await response.json();

        //console.log('API yanıtı:', json);

        if (json.status === 1) {
          const product = json.product;
          const ingredients = product?.ingredients_text || "İçindekiler bilgisi yok";
          const nutriments = product?.nutriments || null;

          navigation.navigate('PhotoPreview', {
            scannedIngredients: ingredients,
            photoUri: null,
            nutritionData: nutriments,
          });
        } else {
          Toast.show('Ürün bulunamadı 🚫', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
          });
          setScanned(false);
        }
    } catch (error) {
        console.error('API hatası:', error);
        Alert.alert('Hata', 'Ürün bilgisi alınamadı.');
        setScanned(false);
    }
  };


  const onBarcodeScanned = ({ data, type }) => {
    //console.log('Tarandı:', data, 'Tip:', type);
    if (!scanned) {
      setScanned(true);
      Toast.show(`Barkod: ${data}`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
      fetchProductData(data);
    }
  };

  const resetScan = () => setScanned(false);

  return { onBarcodeScanned, scanned, resetScan };
};
