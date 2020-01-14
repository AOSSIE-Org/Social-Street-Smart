import pickle
from keras.models import model_from_json
import sys, os, re, csv, codecs, numpy as np, pandas as pd
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from flask import request, jsonify, json
from keras import backend as K
from clickbait_api import app
import tensorflow as tf


data = pd.read_csv("clickbait_api/resources/final_new.csv")

sentences = data["titles"].fillna("DUMMY_VALUE").values
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
		app.logger.info('API called for string: ' + n_str +'. (returned): ' + kk)
		return jsonify({'Result': kk}), 200


	except AssertionError as error:
		app.logger.error('API called for string: ' + n_str + 'Error: '+ error)



def score(n_str):
	n_str=[n_str]
	new_string = tokenizer.texts_to_sequences(n_str)
	new_string = pad_sequences(new_string, maxlen=200)

	with graph.as_default():
  		prediction=loaded_model.predict(new_string)

	#K.clear_session()
	#prediction = loaded_model.predict(new_string)
	#print prediction
	return prediction[0][0]




