from flask import Blueprint, request, jsonify
from ML.helperML import get_features, get_classes, loadLite
import numpy as np

# Blueprint Setup
main_bp = Blueprint('main', __name__)

# Load the model interpreter globally
interpreter = loadLite()

def get_prediction(h, b):
    if interpreter is None:
        print("Error in loading trained model")
        exit()
        
    feat = get_features(h, b)

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    input_data = np.array(feat, dtype=np.float32)
    interpreter.set_tensor(input_details[0]['index'], input_data)
    
    interpreter.invoke()

    output_data = interpreter.get_tensor(output_details[0]['index'])
    class_ = get_classes(output_data)

    return class_

def get_query_results(query, related_articles):
    result = "unknown"

    for news in related_articles:
        # Remove website names from news
        news = news.rsplit(' - ', 1)[0]
        
        pred = get_prediction(query, news)
        if pred == "disagree":
            result = "fake"
            break
        elif pred == "agree":
            result = "genuine"
            break
        
    return result

@main_bp.route('/', methods=['GET'])
def root():
    return "Welcome, this API is working now"

@main_bp.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    query = data.get('query')
    related_articles = data.get('relatedArticles')

    result = get_query_results(query, related_articles)

    response = jsonify({'prediction': result})
    response.headers.add('Access-Control-Allow-Origin', '*')  # To solve CORS issues
    return response
