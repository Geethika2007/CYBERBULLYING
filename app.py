from flask import Flask, request, jsonify
from flask_cors import CORS
from model import CyberbullyingModel
import traceback

app = Flask(__name__)
CORS(app) # Enable cross-origin requests

# Global state to hold the instance of the model
ml_pipeline = CyberbullyingModel()

@app.route('/train', methods=['POST'])
def train_model():
    try:
        data = request.json
        if not data or 'records' not in data:
            return jsonify({'error': 'No dataset provided. Please send JSON with a "records" array containing {text, label} objects.'}), 400
            
        result = ml_pipeline.train(data['records'])
        
        if 'error' in result:
            return jsonify(result), 400
            
        return jsonify(result)

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided for prediction.'}), 400
            
        result = ml_pipeline.predict(str(data['text']))
        
        if 'error' in result:
            return jsonify(result), 400
            
        return jsonify(result)
        
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting AI Security Dashboard Backend...")
    ml_pipeline.initialize_from_local()
    app.run(host='127.0.0.1', port=5000, debug=True)
