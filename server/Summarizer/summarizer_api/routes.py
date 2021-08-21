from summarizer_api import app
from newspaper import Article
from flask import request, jsonify, json
from gensim.summarization.summarizer import summarize 
from urllib.parse import unquote

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
		
		n_str = str(n_str)
		n_str=unquote(n_str)
		n_str=n_str.split('?u=')[1]
		n_str=n_str.split('/?ref')[0]
		article = Article(n_str, language="en")
		article.download() 
		article.parse()
		summ_per = summarize(article.text, ratio = 0.20) 
		print(summ_per)
		return jsonify({'Result': summ_per}), 200


	except AssertionError as error:
		app.logger.error('API called for string: ' + n_str.decode("utf-8") + 'Error: '+ error)






