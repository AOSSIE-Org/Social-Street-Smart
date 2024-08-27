import pickle
import tensorflow as tf
from tensorflow.keras.models import model_from_json
import os
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
# import tflite_runtime.interpreter as tflite
from flask import Blueprint, request, jsonify
import numpy as np


main = Blueprint("main", __name__)
# Set up TensorFlow session and graph
# Load the tokenizer
with open('clickbait_api/resources/sentences.pickle', 'rb') as f:
    tokenizer = pickle.load(f)
    # print(tokenizer)
# n_str = ["this is the best product for you"]
# new_string = tokenizer.texts_to_sequences(n_str)
# print("\n\n")
# print(new_string)
# print("\n\n"+sentences+"\n\n")
# tokenizer = Tokenizer()
# tokenizer.fit_on_texts(sentences)


def load_model_func():
    global loaded_model
    json_file = open('clickbait_api/resources/lstm_clickbait_new.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    loaded_model.load_weights("clickbait_api/resources/lstm_clickbait_new.weights.h5")

load_model_func()

# Initialize the TFLite interpreter
# interpreter = tf.lite.Interpreter(model_path='clickbait_api/resources/lstm_clickbait_new.tflite')
# interpreter.allocate_tensors()

@main.route('/')
def hello_world():
    return 'Hello, World!'

@main.route('/pred', methods=['GET', 'POST'])
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
     # Tokenize and pad the input string
    
    new_string = tokenizer.texts_to_sequences(n_str)
    print(new_string)
    new_string = pad_sequences(new_string, maxlen=40,  padding='post')
    
    # # Get input tensor details
    # input_details = interpreter.get_input_details()
    # output_details = interpreter.get_output_details()
    
    # # Set the input tensor
    # interpreter.set_tensor(input_details[0]['index'], new_string.astype(np.float32))
    
    # # Run inference
    # interpreter.invoke()
    
    # Get the output tensor
    # output = interpreter.get_tensor(output_details[0]['index'])
    
    output = loaded_model.predict(new_string)
    return output[0][0]
