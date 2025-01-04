import json

# JSON dosyasını yükleyin
with open('./food_data.json', 'r') as file:
    data = json.load(file)

def temizle_boş_değerler(data):
    if isinstance(data, dict):  # Eğer data bir sözlükse
        keys_to_delete = [key for key, value in data.items() if value in [None, "", [], {}]]
        for key in keys_to_delete:
            del data[key]
        # Sözlükteki her bir öğe için recursive olarak boş değerleri sil
        for key in data:
            temizle_boş_değerler(data[key])
    elif isinstance(data, list):  # Eğer data bir listeyse
        # Listenin her elemanında boş değerleri temizle
        for item in data:
            temizle_boş_değerler(item)

# Veriyi temizle
temizle_boş_değerler(data)

# Güncellenmiş JSON dosyasını kaydedin
with open('food_allergens.json', 'w') as file:
    json.dump(data, file, indent=4)