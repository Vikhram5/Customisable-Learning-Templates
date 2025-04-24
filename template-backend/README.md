
# Flask Backend API for AAC Game Project

This is the backend API for the AAC Game project, providing various routes for managing quiz data, sentence builders, image management, and settings configuration. The project includes functionality for saving and retrieving MCQ and Match-up quiz data, handling sentence creation with image selection, and managing game settings dynamically.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [API Endpoints](#api-endpoints)
   - [Save MCQ Quiz Data](#save-mcq-quiz-data)
   - [Save Match-Up Quiz Data](#save-match-up-quiz-data)
   - [Settings Configuration](#settings-configuration)
   - [Sentence Image Builder](#sentence-image-builder)
   - [Image Upload](#image-upload)
4. [Running the Application](#running-the-application)
5. [Folder Structure](#folder-structure)

---

## Prerequisites

- Python 3.x
- Flask
- Requests
- Spacy (for natural language processing)
- Flask-CORS
- ConceptNet API access (for synonyms)

## Installation

1. Clone this repository:

```bash
git clone https://github.com/Vikhram5/Customisable-Learning-Templates.git
cd template-backend
```

2. Install the required Python packages:

```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```


## Running the Application

```bash
source /venv/bin/activate
python app.py
```

## API Endpoints

### 1. **Save MCQ Quiz Data**
   - **Route**: `POST /save-json`
   - **Description**: Saves the MCQ quiz data (questions and answers) in JSON format.
   - **Request Body**: JSON containing quiz data.
   - **Response**: Success message or error message.

### 2. **Save Match-Up Quiz Data**
   - **Route**: `POST /match-save`
   - **Description**: Saves the Match-up quiz data (matching pairs) in JSON format.
   - **Request Body**: JSON containing match-up data.
   - **Response**: Success message or error message.

### 3. **Settings Configuration**
   - **Route**: `GET /settings_quiz`
   - **Description**: Retrieves the current settings for the quiz game.
   - **Response**: JSON containing settings data.
   
   - **Route**: `POST /save_settings`
   - **Description**: Saves the settings configuration for the quiz game.
   - **Request Body**: JSON containing settings data.
   - **Response**: Success or error message.

### 4. **Sentence Image Builder**
   - **Route**: `POST /get_images`
   - **Description**: Retrieves images related to a word using lemmatization and synonyms from the ConceptNet API and downloads images from Arasaac.
   - **Request Body**: JSON containing the word.
   - **Response**: JSON containing the word and associated image URLs.
   
   - **Route**: `POST /save_selected_images`
   - **Description**: Saves the selected images and their associated sentence in JSON format.
   - **Request Body**: JSON containing sentence and image names.
   - **Response**: Success or error message.
   
   - **Route**: `DELETE /clear-selected-images`
   - **Description**: Clears the selected images data stored in `selected_images.json`.
   - **Response**: Success or error message.

### 5. **Image Upload**
   - **Route**: `POST /upload-images`
   - **Description**: Allows the upload of image files to be associated with AAC symbols.
   - **Request Body**: Multipart form data with an image file.
   - **Response**: Success message or error message.
   - **Note**: The image file should be named appropriately, and duplicates will be rejected.


The Server API will be available at `http://localhost:5000`.

## Folder Structure

- `app.py` – The main Flask application containing all the routes and business logic.
- `public/` – Static assets like images and JSON files.
  - `selected_images.json` – Stores selected images for sentences.
  - `questions.json` – Stores MCQ quiz data.
  - `match.json` – Stores Match-up quiz data.
  - `settings_quiz.json` – Stores game settings.
  - `symbols.json` – Stores the list of uploaded symbol images.
- `file_names.json` – Stores file names for images associated with words.
- `word_images.json` – Stores images associated with specific words.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
