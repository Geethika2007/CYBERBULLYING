Cyberbullying has become a major issue on social media platforms. This project aims to detect harmful or abusive text using Natural Language Processing (NLP) techniques and Machine Learning models.

The system analyzes user input (text) and classifies it as bullying or non-bullying, helping create safer online environments.
Objectives
Detect cyberbullying in textual data
Classify text into toxic / non-toxic categories
Build a scalable and efficient ML model
Provide real-time predictions through a simple interface
Technologies Used
Programming Language: Python
Libraries:
Pandas
NumPy
Scikit-learn
NLTK / SpaCy
Frontend (Optional): Streamlit / Flask
Tools: Jupyter Notebook, VS Code
Dataset
The dataset contains labeled text data (bullying / non-bullying)
Sources may include:
Twitter comments
Social media posts
Preprocessing steps:
Removing stopwords
Tokenization
Lowercasing
Removing punctuation
Working Process
1. Data Preprocessing
Clean and normalize text
Remove unwanted characters
Convert text into tokens
2. Feature Extraction
TF-IDF Vectorization
Bag of Words (BoW)
3. Model Training
Logistic Regression
Naive Bayes
Support Vector Machine (SVM)
4. Prediction
Input text is processed
Model predicts whether it is bullying or not
How to Run the Project
Extract the zip file
run in the vs Code and open terminal
cd backend
python app.py
