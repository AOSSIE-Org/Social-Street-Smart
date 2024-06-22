import pickle
from tensorflow.keras.models import model_from_json
import os
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from flask import Flask, request, jsonify
import tensorflow as tf

app = Flask(__name__)

# Set up TensorFlow session and graph
session = tf.compat.v1.Session(graph=tf.compat.v1.get_default_graph())
# Load the tokenizer
with open('clickbait_api/resources/sentences.pickle', 'rb') as f:
    sentences = pickle.load(f)

text = 'how are you bro wtf bro'
tokenizer = Tokenizer()
tokenizer.fit_on_texts(text)
graph = tf.compat.v1.get_default_graph()

def load_model_func():
    global loaded_model
    json_file = open('clickbait_api/resources/lstm_clickbait_new.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    loaded_model.load_weights("clickbait_api/resources/lstm_clickBait_new.weights.h5")

load_model_func()

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/pred', methods=['GET', 'POST'])
def predict():
    try:
        if request.method == 'POST':
            n_str = request.form['text']
        elif request.method == 'GET':
            n_str = request.args.get('text')

        if n_str:
            n_str = n_str.encode('utf-8')
            prediction = score(n_str)
            return jsonify({'Result': str(prediction)}), 200
        else:
            return jsonify({'error': 'No text provided'}), 400

    except AssertionError as error:
        return jsonify({'error': str(error)}), 500

def score(n_str):
    n_str = n_str.decode("utf-8")
    n_str = [n_str]
    new_string = tokenizer.texts_to_sequences(n_str)
    new_string = pad_sequences(new_string, maxlen=200)
    
    with session.as_default():
        with graph.as_default():
            prediction = loaded_model.predict(new_string)
    
    return prediction[0][0]

if __name__ == '__main__':
    app.run(debug=True, port=5001)
