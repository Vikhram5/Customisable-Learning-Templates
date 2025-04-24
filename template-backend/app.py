from flask import Flask, request, jsonify
import os
import requests
import json
import spacy
from flask_cors import CORS

app = Flask(__name__)

FRONTEND_URLS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://192.168.0.101:5173",
    "http://10.11.159.126:5173",
    "http://192.168.145.118:5173",
    "http://192.168.107.152:5173"
]

CORS(app, resources={r"/*": {"origins": FRONTEND_URLS}})

MCQ_PATH="../template-builder/public/questions.json"
MATCHUP_PATH="../template-builder/public/match.json"


#-------------------------------MCQ Template-------------------------------#

@app.route('/save-json', methods=['POST'])
def save_json():
    data = request.get_json()
    try:
        with open(MCQ_PATH, 'w') as file:
            json.dump(data, file, indent=2)
        return jsonify({'message': 'Data saved successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
#-------------------------------Match Template-------------------------------#


@app.route('/match-save', methods=['POST'])
def match_json():
    data = request.get_json()
    try:
        with open(MATCHUP_PATH, 'w') as file:
            json.dump(data, file, indent=2)
        return jsonify({'message': 'Data saved successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
SETTINGS_FILE = "../template-builder/public/settings_quiz.json"


#-------------------------------settings configuration-------------------------------#

@app.route("/settings_quiz", methods=["GET"])
def get_settings():
    try:
        with open(SETTINGS_FILE, "r") as file:
            settings = json.load(file)
        return jsonify(settings)
    except Exception as e:
        return jsonify({"error": "Failed to load settings", "details": str(e)}), 500

@app.route("/save_settings", methods=["POST"])
def save_settings():
    try:
        new_settings = request.json
        with open(SETTINGS_FILE, "w") as file:
            json.dump(new_settings, file, indent=2)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": "Failed to save settings", "details": str(e)}), 500
    

#-------------------------------image based sentence builder-------------------------------#

nlp = spacy.load("en_core_web_sm")

ASSETS_FOLDER = os.path.join(os.getcwd(), "../template-builder", "public", "images")
PUBLIC_FOLDER = os.path.join(os.getcwd(), "../template-builder","public")
print(ASSETS_FOLDER)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths to JSON files
images_list = os.path.join(BASE_DIR, "file_names.json")
word_mapping = os.path.join(BASE_DIR, "word_images.json")

def load_json_file(file_path, default_data=None):
    if os.path.exists(file_path):
        try:
            with open(file_path, "r") as f:
                return json.load(f)
        except json.JSONDecodeError:
            print(f"Error decoding JSON in file {file_path}. Returning default data.")
            return default_data or {}
    else:
        return default_data or {}

file_names = load_json_file(images_list, {})
word_images = load_json_file(word_mapping, {})
#lemmatize using spacy library
def lemmatize_word(word):
    word = word.lower() 
    doc = nlp(word)
    lemma = doc[0].lemma_.lower() 
    return lemma

#top n synonyms ConceptNet API
def get_top_closest_base_form_synonyms(word, top_n=3):
    base_form = lemmatize_word(word) 
    synonyms = set()

    url = f"http://api.conceptnet.io/c/en/{base_form}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        for edge in data.get("edges", []):
            if edge.get("rel", {}).get("label") == "Synonym":
                synonyms.add(edge.get("start").get("label"))
    
    print(base_form)
    return base_form, list(synonyms)[:top_n]

# download images for a given symbol using Arasaac API
def download_images_for_symbol(symbol):
    folder_path = os.path.join(ASSETS_FOLDER, symbol)
    os.makedirs(folder_path, exist_ok=True)

    url = f"https://api.arasaac.org/api/pictograms/en/search/{symbol}"
    response = requests.get(url)
    data = response.json()

    image_urls = []
    if response.status_code == 200 and data:
        for i, item in enumerate(data[:5]):  # 5 images per word
                pictogram_id = item["_id"]
                img_url = f"https://static.arasaac.org/pictograms/{pictogram_id}/{pictogram_id}_500.png"
                
                img_data = requests.get(img_url).content
                image_filename = f"{symbol}_{i}.png"
                image_path = os.path.join(folder_path, image_filename)
                with open(image_path, "wb") as f:
                    f.write(img_data)
                
                image_urls.append(image_filename)
        
        return image_urls
    else:
        return jsonify({"error": "No images found for the word"}), 404

# Route to get images for a word (based on lemmatization)
@app.route("/get_images", methods=["POST"])
def get_images():
    data = request.json
    word = data.get("word")
    if not word:
        return jsonify({"error": "No word provided"}), 400
    
    base_form, _ = get_top_closest_base_form_synonyms(word)
    image_urls = download_images_for_symbol(base_form)
    
    if word not in word_images:
        word_images[word] = []
    
    word_images[word].extend(image_urls)

    with open(images_list, "w") as f:
        json.dump(file_names, f, indent=4)
    
    with open(word_mapping, "w") as f:
        json.dump(word_images, f, indent=4)
        
    print(base_form)
    print(image_urls)
    
    return jsonify({"word": base_form, "images": image_urls})

# Route to save selected images and associated sentence
@app.route('/save_selected_images', methods=['POST'])
def save_selected_images():
    try:
        data = request.json
        sentence = data.get("sentence", "")
        image_names = data.get("imageNames", [])

        file_path = os.path.abspath(
            os.path.join(os.getcwd(), "../template-builder/public/selected_images.json")
        )
        
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                existing_data = json.load(f)
        else:
            existing_data = []

        new_entry = {
            "sentence": sentence,
            "image_names": image_names
        }

        existing_data.append(new_entry)

        with open(file_path, 'w') as f:
            json.dump(existing_data, f, indent=4)
        
        return jsonify({"success": True, "message": "Sentence and image names saved successfully!"})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": "Failed to save sentence and image names."})
    

#-------------------------------Clear sentence data-------------------------------#

@app.route("/clear-selected-images", methods=["DELETE"])
def clear_selected_images():
    file_path = os.path.abspath(
        os.path.join(os.getcwd(), "../template-builder/public/selected_images.json")
    )
    if os.path.exists(file_path):
        with open(file_path, "w") as f:
            json.dump([], f)
        return jsonify({"status": "success", "message": "Data cleared"}), 200
    return jsonify({"status": "error", "message": "File not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
    
#-------------------------------upload images-------------------------------#

UPLOAD_FOLDER = '../template-builder/public/symbols'
SYMBOLS_JSON = '../template-builder/public/symbols.json'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload-images', methods=['POST'])
def upload_images():
    if 'symbol' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['symbol']
    filename = file.filename

    # Load current symbols from JSON
    symbols = []
    if os.path.exists(SYMBOLS_JSON):
        with open(SYMBOLS_JSON, 'r') as f:
            try:
                symbols = json.load(f)
            except json.JSONDecodeError:
                return jsonify({'error': 'Corrupted symbols.json file'}), 500

    # Check for duplicate filename
    if filename in symbols:
        return jsonify({
            'error': f"Image with the name '{filename}' already exists. Please rename your file and try again."
        }), 409  # Conflict

    # Save the file
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(save_path)

    # Add new filename to symbols.json
    symbols.append(filename)
    with open(SYMBOLS_JSON, 'w') as f:
        json.dump(symbols, f, indent=2)

    return jsonify({'filename': filename}), 200

#--------------end of api endpoints----------------#

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)