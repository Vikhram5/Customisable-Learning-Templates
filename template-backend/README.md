
# Flask Backend Application for customisable gamified templates

This backend API is designed specifically for a project that supports students who use Augmentative and Alternative Communication (AAC) methods , providing various routes for managing quiz data, sentence builders, image management, and settings configuration. The project includes functionality for saving and retrieving MCQ and Match-up quiz data, handling sentence creation with image selection, and managing game settings dynamically.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. API Endpoints
   - Save MCQ Quiz Data
   - Save Match-Up Quiz Data
   - Settings Configuration
   - Sentence Image Builder
   - Image Upload
4. [Running the Application](#running-the-application)
5. [Folder Structure](#folder-structure)

---

## Prerequisites

- Python 3.x
- Flask
- Spacy (for natural language processing)
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

The Server API will be available at `http://localhost:5000`.

## Folder Structure

- `app.py` – The main Flask application containing all the routes and business logic.
- `public/` – Static assets like images and JSON files.
  - `selected_images.json` – Stores selected images for sentences.
  - `questions.json` – Stores MCQ quiz data.
  - `match.json` – Stores Match-up quiz data.
  - `settings_quiz.json` – Stores game settings.
  - `symbols.json` – Stores the list of uploaded symbol images.
- `word_images.json` – Stores images associated with specific words.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
