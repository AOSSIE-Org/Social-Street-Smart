from flask import request, jsonify, json
from urllib.parse import unquote
from flask import Flask
from groq import Groq
from newspaper import Article
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def summarize(text, ratio):
    summaryLength = int(len(text) * ratio)
    client = Groq(api_key="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")
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": f"Write a summary of the following text:\n{text}\nThe summary should be very easy to understand and in 
                			bullet points wise with neat formatted ouput"
            }
        ],
        
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

        # Check if input is a URL or plain text
        if n_str.startswith('http://') or n_str.startswith('https://'):
            article = Article(n_str, language="en")
            article.download()
            article.parse()
            input_text = article.text
        else:
            input_text = n_str

        # Generate summary
        summ_per = summarize(input_text, ratio=0.20)
        return jsonify({'Result': summ_per}), 200

    except Exception as error:
        return jsonify({'Error': str(error)}), 400
