import pickle
from tensorflow.keras.models import model_from_json
import sys, os, re, csv, codecs
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from flask import request, jsonify, json
from tensorflow.keras import backend as K
from clickbait_api import app
import tensorflow as tf

from tensorflow.python.keras.backend import set_session
from tensorflow.python.keras.models import load_model

#tf_config = some_custom_config
session = tf.Session()


#data = pd.read_csv("clickbait_api/resources/final_new.csv")

#sentences = data["titles"].fillna("DUMMY_VALUE").values
#print(type(sentences))
import pickle
with open('clickbait_api/resources/sentences.pickle', 'rb') as f:
	sentences= pickle.load(f)

#with open('sentences.pickle', 'wb') as f:
#    pickle.dump(sentences, f)
    
tokenizer = Tokenizer(num_words=22000)
tokenizer.fit_on_texts(sentences)

graph = tf.get_default_graph()


def load_model():
	global loaded_model
	json_file = open('clickbait_api/resources/lstm_clickbait_new.json', 'r')
	loaded_model = json_file.read()
	json_file.close()
	loaded_model = model_from_json(loaded_model)
	loaded_model.load_weights("clickbait_api/resources/lstm_clickBait_new.h5")

set_session(session)
load_model()

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/pred', methods=['GET','POST'])
def predict():
	try:
		if request.method == 'POST':
			n_str= request.form['text']

		if request.method == 'GET':
			n_str= request.args.get('text')
		
		n_str = n_str.encode('utf-8')
		#n_str=str(n_str)
		kk=score(n_str)
		kk=str(kk)
		#respo= {'Result': 'none'}
		#respo['Result'] = str(kk)
		#print (jsonify(respo)).json()
		#app.logger.info('API called for string: ' + n_str +'. (returned): ' + kk)
		return jsonify({'Result': kk}), 200


	except AssertionError as error:
		pass
		#app.logger.error('API called for string: ' + n_str.decode("utf-8") + 'Error: '+ error)



def score(n_str):
	n_str = n_str.decode("utf-8")
	n_str=[n_str]
	print (n_str)
	new_string = tokenizer.texts_to_sequences(n_str)
	new_string = pad_sequences(new_string, maxlen=200)
	with session.as_default():
		with graph.as_default():
			prediction=loaded_model.predict(new_string)

	#K.clear_session()
	#prediction = loaded_model.predict(new_string)
	#print prediction
	return prediction[0][0]




