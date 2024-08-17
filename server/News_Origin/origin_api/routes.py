import sys, os, re, csv, codecs
from flask import request, jsonify, json
from origin_api import app
from .origin_analyze import SourceChecker 
import nltk
nltk.download('punkt')
nltk.data.path = ['origin_api/nltk_data']
from nltk.corpus import stopwords
# nltk.download('punkt')
# nltk.download('wordnet')
# nltk.download('stopwords')
# nltk.download('averaged_perceptron_tagger')
# nltk.download('maxent_ne_chunker')
# nltk.download('words')

@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/pred', methods=['GET','POST'])
def predict():
	if request.method == 'POST':
		text = request.form['text']

	if request.method == 'GET':
		text = request.args.get('text')
		key = request.args.get('key')
	language = 'english'
	if len(key) != 39 or key == None:
		key = "AIzaSyCMcQKjtDcLJ7lVXRyoSiO0MwDBkztyi84"
		
	sc = SourceChecker(text, language, key)
	queries = sc.get_queries()
	domains = sc.get_urls(queries)
	sc.load_domains()
	kk=sc.render_output(domains)
	#print (jsonify(kk['HIGH']))
	return jsonify(kk)
		#return jsonify({'Result': kk}), 200