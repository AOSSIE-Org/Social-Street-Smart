from flask import request, jsonify, json
from urllib.parse import unquote
from flask import Flask
from groq import Groq
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

def summarize(text, ratio):
    client = Groq(api_key="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")
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": f"Write a summary of the following text:\n{text}\n"
                           f"summary should be very easy to understand and inpoints wise with neat formatted output."
            }
        ],
    )
    return completion.choices[0].message.content

def fetch_article_content(url):
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            paragraphs = soup.find_all('p')
            article_text = " ".join([p.get_text() for p in paragraphs])
            return article_text.strip()
        else:
            raise Exception(f"Failed to fetch the article. Status code: {response.status_code}")
    except Exception as e:
        raise Exception(f"Error fetching article content: {str(e)}")

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
            input_text = fetch_article_content(n_str)
        else:
            input_text = n_str

        # Generate summary
        summ_per = summarize(input_text, ratio=0.20)
        return jsonify({'Result': summ_per}), 200

    except Exception as error:
        return jsonify({'Error': str(error)}), 400
