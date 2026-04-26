# Cyberbullying Detection System

Cyberbullying has become a serious issue on social media platforms, affecting individuals' mental health and online safety. This project focuses on detecting harmful or abusive text using Natural Language Processing (NLP) and Machine Learning techniques.

The system analyzes user input text and classifies it as **bullying** or **non-bullying**, helping create a safer digital environment.

---

##Objectives

- Detect cyberbullying in textual data  
- Classify text into **toxic / non-toxic** categories  
- Build an efficient and scalable ML model  
- Provide real-time predictions through a simple interface  

---

## Features

- NLP-based text processing  
- Real-time prediction system  
- Multiple ML models for comparison  
- Clean and structured preprocessing pipeline  
- Optional web interface (Streamlit / Flask)  

---

## 🛠️ Tech Stack

### Programming Language
- Python

### Libraries
- Pandas  
- NumPy  
- Scikit-learn  
- NLTK / SpaCy  

### Frontend (Optional)
- Streamlit / Flask  

### Tools
- Jupyter Notebook  
- VS Code  

---

## 📂 Project Structure
├── backend/
│ ├── app.py
│ ├── model.pkl
│ └── preprocessing.py
├── dataset/
├── notebooks/
├── frontend/ (optional)
└── README.md
##  Dataset

The dataset consists of labeled text data categorized as:

- Bullying  
- Non-bullying  

### Sources
- Twitter comments  
- Social media posts  

### Preprocessing Steps
- Removing stopwords  
- Tokenization  
- Lowercasing text  
- Removing punctuation  

---

## Working Process

### Data Preprocessing
- Clean and normalize text  
- Remove unwanted characters  
- Convert text into tokens  

### Feature Extraction
- TF-IDF Vectorization  
- Bag of Words (BoW)  

###  Model Training
- Logistic Regression  
- Naive Bayes  
- Support Vector Machine (SVM)  

###  Prediction
- User input text is processed  
- Model predicts whether the text is **bullying or not**  

---

## How to Run the Project

1. Extract the project files (if zipped)

2. Open the project in **VS Code**

3. Open terminal and navigate to backend:
   ```bash
   cd backend
   python app.py
