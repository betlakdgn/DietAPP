import json


with open('./food_data.json', 'r') as file:
    data = json.load(file)

def temizle_boş_değerler(data):
    if isinstance(data, dict):  
        keys_to_delete = [key for key, value in data.items() if value in [None, "", [], {}]]
        for key in keys_to_delete:
            del data[key]
        
        for key in data:
            temizle_boş_değerler(data[key])
    elif isinstance(data, list): 
        
        for item in data:
            temizle_boş_değerler(item)


temizle_boş_değerler(data)


with open('food_allergens.json', 'w') as file:
    json.dump(data, file, indent=4)