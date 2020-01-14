import pickle
from keras.models import model_from_json
import sys, os, re, csv, codecs, numpy as np, pandas as pd
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from flask import request, jsonify, json
from hate_speech_api import app
from keras import backend as K
import tensorflow as tf


data = pd.read_csv("hate_speech_api/resources/train.csv")
sentences = data["comment_text"].fillna("DUMMY_VALUE").values
tokenizer = Tokenizer(num_words=22000)
tokenizer.fit_on_texts(sentences)

graph = tf.get_default_graph()


def load_model():
	global loaded_model
	json_file = open('hate_speech_api/resources/lstm_hate_speech.json', 'r')
	loaded_model = json_file.read()
	json_file.close()
	loaded_model = model_from_json(loaded_model)
	loaded_model.load_weights("hate_speech_api/resources/lstm_hate_speech.h5")

load_model()


@app.route('/pred', methods=['GET','POST'])
def predict():
	try:
		if request.method == 'POST':
			n_str= request.form['text']

		if request.method == 'GET':
			n_str= request.args.get('text')

		n_str = n_str.encode('utf-8')
		#nstr=str(nstr)
		predictions=score(n_str)
		#print('Toxic:         {:.0%}'.format(predictions[0][0]))
		#print('Severe Toxic:  {:.0%}'.format(predictions[0][1]))
		#print('Obscene:       {:.0%}'.format(predictions[0][2]))
		predictions = predictions.tolist()
		#print predictions
		app.logger.info('API called for string: ' + n_str +'. (returned): ' + str(predictions))

		return jsonify({'Toxic': predictions[0][0],
						'Severe Toxic': predictions[0][1],
						'Obscene': predictions[0][2],
						'Threat': predictions[0][3],
						'Insult': predictions[0][4],
						'Identity Hate': predictions[0][5]}), 200

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
	return prediction






