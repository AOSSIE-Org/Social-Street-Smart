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

@app.route('/pred', methods=['GET','POST'])
def predict():
	nstr= request.args.get('text')
	nstr = nstr.encode('utf-8')
	#nstr=str(nstr)
	kk=nn(nstr)
	kk=str(kk)
	#respo= {'Result': 'none'}
	#respo['Result'] = str(kk)
	#print (jsonify(respo)).json()
	return jsonify({'Result': kk}), 200



def nn(nstr):
	nstr=[nstr]
	new_string = tokenizer.texts_to_sequences(nstr)
	new_string = pad_sequences(new_string, maxlen=200)

	with graph.as_default():
  		prediction=loaded_model.predict(new_string)

	#K.clear_session()
	#prediction = loaded_model.predict(new_string)
	#print prediction
	return prediction[0][0]




