import os
from os.path import join, dirname
from dotenv import load_dotenv
import json
import sqlite3
import requests
from flask import Flask, request, jsonify
import numpy as np

from ML.helperML import get_features, get_classes, loadLite

# Load environment variables from .env file
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

interpreter = None
application = Flask(__name__)

# Function to fetch news details from SQLite3 database
def get_news_from_db(db_path, query_content):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT content FROM NewsTable")
    rows = cursor.fetchall()
    
    for row in rows:
        news_content = row[0]
        pred = get_prediction(query_content, news_content)
        if pred == "disagree":
            conn.close()
            return "fake"
        elif pred == "agree":
            conn.close()
            return "genuine"

    conn.close()
    return "unknown"

# Prediction function
def get_prediction(h, b):
    global interpreter
    if interpreter is None:
        print("Error in loading trained model\n")
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

# Function to handle news website queries
def newsWeb_query(query, db_path="../newsScrapper/news_articles.db"):
    query_content = query['description']
    result = get_news_from_db(db_path, query_content)
    return result

@application.route('/', methods=['GET'])
def index():
    return "AOSSIE's Fake News API for Social Street Smart"

@application.route('/predict', methods=['POST'])
def predict():
    query = request.json
    query_body = query['body']
    query_source = query['source']
    result = 'Could not verify / find the source of the query'
    
    if query_source == "newsWeb":
        result = newsWeb_query(query_body)
    else:
        print("Error in finding source of query")

    r = jsonify({'prediction': result})
    r.headers.add('Access-Control-Allow-Origin', '*')
    return r

# Load the TFLite model interpreter
interpreter = loadLite()

if __name__ == '__main__':
    application.run(port=5005)
