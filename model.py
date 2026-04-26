import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, precision_score, recall_score, f1_score
import os

class CyberbullyingModel:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.fallback_dict = ['pathetic', 'stupid', 'ugly', 'worthless', 'fool', 'dumb', 'hate', 'useless', 'idiot', 'trash', 'loser']
        
    def initialize_from_local(self, file_path='../cyberbullying_binary_dataset.xlsx'):
        print(f"Initializing Machine Learning Pipeline from local dataset at {file_path}...")
        try:
            # Fallback for when running directly from root vs backend dir
            if not os.path.exists(file_path):
                 file_path = 'cyberbullying_binary_dataset.xlsx'
                 
            if not os.path.exists(file_path):
                 print(f"Error: Could not find dataset {file_path}")
                 return False

            df = pd.read_excel(file_path)
            
            if 'text' not in df.columns or 'label' not in df.columns:
                print("Error: Dataset must contain 'text' and 'label' columns.")
                return False
                
            # Basic preprocessing
            df['text'] = df['text'].fillna('').astype(str).str.lower()
            
            # Ensure labels are binary integers
            def parse_label(val):
                val_str = str(val).lower().strip()
                if val_str in ['1', 'toxic', 'true', 'yes']:
                    return 1
                return 0
                
            df['label'] = df['label'].apply(parse_label)
            
            X = df['text']
            y = df['label']
            
            if len(X) < 10:
                 print("Error: Dataset too small for training.")
                 return False
            
            # 1. TF-IDF Vectorization
            print("1. TF-IDF Vectorization started...")
            self.vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
            X_vec = self.vectorizer.fit_transform(X)
            
            # 2. Train-Test Split (80/20)
            print("2. Train-Test Split started...")
            X_train, X_test, y_train, y_test = train_test_split(X_vec, y, test_size=0.2, random_state=42)
            
            # 3. Model Training
            print("3. Model Training started...")
            self.model = LogisticRegression(max_iter=1000)
            self.model.fit(X_train, y_train)
            
            # 4. Evaluation
            y_pred = self.model.predict(X_test)
            acc = accuracy_score(y_test, y_pred)
            prec = precision_score(y_test, y_pred, zero_division=0)
            rec = recall_score(y_test, y_pred, zero_division=0)
            f1 = f1_score(y_test, y_pred, zero_division=0)
            print(f"4. Evaluation finished! Accuracy: {acc * 100:.2f}%, Precision: {prec * 100:.2f}%, Recall: {rec * 100:.2f}%, F1: {f1 * 100:.2f}%")
            
            return True
        except Exception as e:
            print(f"Failed to initialize model from local dataset: {e}")
            return False

    def train(self, records):
        try:
            df = pd.DataFrame(records)
            
            if 'text' not in df.columns or 'label' not in df.columns:
                return {'error': 'Dataset must contain "text" and "label" keys.'}
                
            df['text'] = df['text'].fillna('').astype(str).str.lower()
            
            def parse_label(val):
                val_str = str(val).lower().strip()
                if val_str in ['1', 'toxic', 'true', 'yes']:
                    return 1
                return 0
                
            df['label'] = df['label'].apply(parse_label)
            
            X = df['text']
            y = df['label']
            
            if len(X) < 10:
                 return {'error': 'Dataset too small. Please provide at least 10 rows.'}
            
            self.vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
            X_vec = self.vectorizer.fit_transform(X)
            
            X_train, X_test, y_train, y_test = train_test_split(X_vec, y, test_size=0.2, random_state=42)
            
            self.model = LogisticRegression(max_iter=1000)
            self.model.fit(X_train, y_train)
            
            y_pred = self.model.predict(X_test)
            acc = float(accuracy_score(y_test, y_pred))
            prec = float(precision_score(y_test, y_pred, zero_division=0))
            rec = float(recall_score(y_test, y_pred, zero_division=0))
            f1 = float(f1_score(y_test, y_pred, zero_division=0))
            cm = confusion_matrix(y_test, y_pred)
            
            if cm.shape == (1, 1):
                val = int(cm[0][0])
                if y_test.iloc[0] == 1:
                    cm_dict = {'tn': 0, 'fp': 0, 'fn': 0, 'tp': val}
                else:
                    cm_dict = {'tn': val, 'fp': 0, 'fn': 0, 'tp': 0}
            else:
                cm_dict = {
                    'tn': int(cm[0][0]),
                    'fp': int(cm[0][1]),
                    'fn': int(cm[1][0]),
                    'tp': int(cm[1][1])
                }
            
            return {
                'success': True,
                'accuracy': acc,
                'precision': prec,
                'recall': rec,
                'f1_score': f1,
                'confusion_matrix': cm_dict,
                'message': 'Model trained successfully via Scikit-Learn!'
            }

        except Exception as e:
            return {'error': str(e)}

    def predict(self, text):
        if self.model is None or self.vectorizer is None:
            return {'error': 'Model is not trained yet. Please train the model first.'}
            
        try:
            text = str(text).lower()
            vec = self.vectorizer.transform([text])
            
            prob = float(self.model.predict_proba(vec)[0][1])
            pred = int(self.model.predict(vec)[0])
            
            weights = self.model.coef_[0]
            triggers = []
            words = text.split()
            
            for w in words:
                clean_w = ''.join(c for c in w if c.isalnum())
                
                if clean_w in self.vectorizer.vocabulary_:
                    idx = self.vectorizer.vocabulary_[clean_w]
                    if weights[idx] > 0 and clean_w not in triggers:
                        triggers.append(clean_w)
                
                if clean_w in self.fallback_dict and clean_w not in triggers:
                    triggers.append(clean_w)
            
            triggers.sort(key=len, reverse=True)
            
            return {
                'prediction': pred,
                'toxicity_probability': prob,
                'triggers': triggers
            }
            
        except Exception as e:
            return {'error': str(e)}
