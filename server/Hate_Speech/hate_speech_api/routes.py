import pickle
# import tensorflow as tf
# from keras.models import model_from_json
# from keras.preprocessing.sequence import pad_sequences
from flask import Blueprint, request, jsonify
import numpy as np
import tflite_runtime.interpreter as tflite

# app = Flask(__name__)
main = Blueprint("main", __name__)
# Load the tokenizer
with open('hate_speech_api/resources/tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)
def custom_pad_sequences(sequences, maxlen, padding='pre', truncating='post', value=0):
    padded_sequences = np.full((len(sequences), maxlen), value, dtype=np.int32)
    
    for i, seq in enumerate(sequences):
        if len(seq) > maxlen:
            if truncating == 'pre':
                truncated_seq = seq[-maxlen:]
            else:
                truncated_seq = seq[:maxlen]
            padded_sequences[i] = truncated_seq
        else:
            if padding == 'pre':
                padded_sequences[i, -len(seq):] = seq
            else:
                padded_sequences[i, :len(seq)] = seq

    return padded_sequences
# # Load the model architecture
# with open('hate_speech_api/resources/lstm_hate_speech.json', 'r') as json_file:
#     loaded_model_json = json_file.read()
# loaded_model = model_from_json(loaded_model_json)

# # Load the model weights
# loaded_model.load_weights('hate_speech_api/resources/lstm_hate_speech.h5')

interpreter = tflite.Interpreter('hate_speech_api/resources/model.tflite')
interpreter.allocate_tensors()

# Get input and output tensor details
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

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
            # print(n_str)

        if n_str:
            n_str = n_str.encode('utf-8')
            predictions = score(n_str)
            predictions = predictions.tolist()
            return jsonify({
                'Toxic': predictions[0][0],
                'Severe Toxic': predictions[0][1],
                'Obscene': predictions[0][2],
                'Threat': predictions[0][3],
                'Insult': predictions[0][4],
                'Identity Hate': predictions[0][5]
            }), 200
        else:
            return jsonify({'error': 'No text provided'}), 400

    except Exception as error:
        return jsonify({'error': str(error)}), 500

def score(n_str):
    n_str = n_str.decode('utf-8')
    n_str = [n_str]
    new_string = tokenizer.texts_to_sequences(n_str)
    # print(new_string)
    # new_string = pad_sequences(new_string, maxlen=200)

    new_string = custom_pad_sequences(new_string, maxlen=200)

    print(new_string)
    new_string = np.array(new_string, dtype=np.float32)  # dtype may vary based on model
    # Set input tensor
    interpreter.set_tensor(input_details[0]['index'], new_string)
    # Run inference
    interpreter.invoke()
    # Get output tensor
    prediction = interpreter.get_tensor(output_details[0]['index'])
    return prediction


