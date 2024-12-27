from summarizer_api import app
from newspaper import Article
from flask import request, jsonify, json
from urllib.parse import unquote
from flask import Flask
from groq import Groq


app = Flask(__name__)

def summarize(text, ratio):
	summaryLength = int(len(text)*ratio)
	client = Groq(api_key="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")
	completion = client.chat.completions.create(
		model="llama3-70b-8192",
		messages=[
			{"role": "system", "content": "You are a helpful assistant."},
			{
				"role": "user",
				"content": f"Write a summary of the following text:\n{text}\nThe summary should be in {summaryLength} words"
			}
		],
		max_tokens=100
	)
	return completion.choices[0].message.content

@app.route('/pred', methods=['GET', 'POST'])
def predict():
    try:
        if request.method == 'POST':
            n_str = request.form['text']
        elif request.method == 'GET':
            n_str = request.args.get('text')

        n_str = str(n_str)
        n_str = unquote(n_str)
        article = Article(n_str, language="en")
        article.download()
        article.parse()

        # Generate summary
        summ_per = summarize(article.text, ratio=0.20)
        return jsonify({'Result': summ_per}), 200
    except Exception as error:
        return jsonify({'Error': str(error)}), 400


