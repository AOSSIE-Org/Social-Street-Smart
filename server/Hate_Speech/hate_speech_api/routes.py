import pickle
import tensorflow as tf
from keras.models import model_from_json
from keras.preprocessing.sequence import pad_sequences
from flask import Blueprint, request, jsonify

# app = Flask(__name__)
main = Blueprint("main", __name__)
# Load the tokenizer
with open('hate_speech_api/resources/tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

# Load the model architecture
with open('hate_speech_api/resources/lstm_hate_speech.json', 'r') as json_file:
    loaded_model_json = json_file.read()
loaded_model = model_from_json(loaded_model_json)

# Load the model weights
loaded_model.load_weights('hate_speech_api/resources/lstm_hate_speech.h5')

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
    # print(n_str)
    n_str = n_str.decode('utf-8')
    n_str = [n_str]
    new_string = tokenizer.texts_to_sequences(n_str)
    new_string = pad_sequences(new_string, maxlen=200)
    # print(new_string)
    prediction = loaded_model.predict(new_string)
    return prediction


