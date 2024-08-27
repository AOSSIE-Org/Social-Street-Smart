from summarizer_api import app
from newspaper import Article
from flask import request, jsonify, json
from urllib.parse import unquote

from openai import OpenAI

def summarize(text, ratio):
	summaryLength = int(len(text)*ratio)
	client = OpenAI(api_key = "sk-quXV-Cuxe-_yPloGspA1D3a6Xx7lqFKF9xFq4H-O4ET3BlbkFJGFDZJIMDVOOtSF-Itczi_FsI2pdxl97vo-DB3TXJoA")

	completion = client.chat.completions.create(
		model="gpt-4o-mini",
		messages=[
			{"role": "system", "content": "You are a helpful assistant."},
			{
				"role": "user",
				"content": f"Write a summer of the following text:\n{text}\nThe summary should be in {summaryLength} words"
			}
		],
		max_tokens=100
	)
	return completion.choices[0].message.content

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
		article = Article(n_str, language="en")
		article.download() 
		article.parse()
		summ_per = summarize(article.text, ratio = 0.20) 
		print(summ_per)
		return jsonify({'Result': summ_per}), 200


	except AssertionError as error:
		app.logger.error('API called for string: ' + n_str.decode("utf-8") + 'Error: '+ error)






