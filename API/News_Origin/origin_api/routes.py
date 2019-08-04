import pickle
from keras.models import model_from_json
import sys, os, re, csv, codecs, numpy as np, pandas as pd
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from flask import request, jsonify, json
from keras import backend as K
from origin_api import app
import tensorflow as tf
from origin_analyze import SourceChecker 



data = pd.read_csv("origin_api/resources/final_new.csv")

sentences = data["titles"].fillna("DUMMY_VALUE").values
tokenizer = Tokenizer(num_words=22000)
tokenizer.fit_on_texts(sentences)

graph = tf.get_default_graph()


def load_model():
	global loaded_model
	json_file = open('origin_api/resources/lstm_clickbait_new.json', 'r')
	loaded_model = json_file.read()
	json_file.close()
	loaded_model = model_from_json(loaded_model)
	loaded_model.load_weights("origin_api/resources/lstm_clickBait_new.h5")

load_model()




@app.route('/')
def hello_world():
    return 'Hello, World!'




@app.route('/pred', methods=['GET','POST'])
def predict():
	if request.method == 'POST':
		text = request.form['text']

	if request.method == 'GET':
		text = request.args.get('text')
	language = 'english'
	sc = SourceChecker(text, language)
	queries = sc.get_queries()
	domains = sc.get_urls(queries)
	sc.load_domains()
	sc.render_output(domains)
	#sc.render_graph(domains)
		#return jsonify({'Result': kk}), 200






