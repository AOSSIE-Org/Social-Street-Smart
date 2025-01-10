import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
import nltk
from nltk.util import ngrams as nltk_ngrams
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import requests
from dotenv import load_dotenv
import pandas as pd
from collections import defaultdict
import re
import tldextract
import logging
# Download required NLTK data
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger_eng')
nltk.download('punkt_tab')
nltk.download('wordnet')
nltk.download('maxent_ne_chunker')
nltk.download('maxent_ne_chunker_tab')
nltk.download('words')

# Load environment variables
load_dotenv()

# Flask setup
app = Flask(__name__)
app.debug = True

# Swagger setup
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL, API_URL, config={'app_name': "Social Street Smart - News Origin"}
)
app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)

# CORS configuration
CORS(app)

# Environment variables
API_KEY = "AIzaSyCliEGPHh_Jr5UUqtFg6ZkTR2c7_6xDSSk" # Replace with your valid CUsToM search api key
CSE_ID = "5029d1ba1565043b6"  # Replace with your valid CSE ID


class SourceChecker:
    def __init__(self, text, max_queries=8, span=8):
        self.text = text
        self.max_queries = max_queries
        self.span = span
        self.cat_dict = defaultdict(list)

    def get_queries(self):
        """Generate meaningful n-gram queries."""
        words = word_tokenize(self.text)
        queries = []

        for span in range(4, self.span + 1):  # Start from 4-word phrases
            for ngram in nltk_ngrams(words, n=span):
                r_string = " ".join(ngram)
                if len(r_string.split()) >= 4:  # Minimum meaningful query length
                    queries.append(r_string)

        return list(dict.fromkeys(queries[:self.max_queries]))  # Deduplicate and limit queries

    def search_google(self, query):
        """Search Google Custom Search API."""
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            'key': API_KEY,
            'cx': CSE_ID,
            'q': query,
            'num': 10,
        }
        try:
            response = requests.get(url, params=params)
            if response.status_code == 200:
                return response.json().get('items', [])
            logging.error(f"Google API error: {response.status_code} {response.text}")
            return []
        except Exception as e:
            logging.error(f"Error during Google search: {e}")
            return []

    def render_output(self, domains):
        """Render results."""
        output = defaultdict(list)

        for domain, queries in domains.items():
            overlap = len(queries) / self.max_queries
            if overlap >= 0.6:
                output['HIGH'].append(domain)
            elif overlap >= 0.4:
                output['SOME'].append(domain)
            elif overlap >= 0.2:
                output['MINIMAL'].append(domain)

        return dict(output)


@app.route('/pred', methods=['GET'])
def predict():
    try:
        text = request.args.get('text')
        if not text:
            return jsonify({"error": "No text provided"}), 400

        sc = SourceChecker(text)
        queries = sc.get_queries()

        if not queries:
            return jsonify({"error": "No valid queries generated"}), 400

        domains = defaultdict(list)
        for query in queries:
            results = sc.search_google(query)
            for result in results:
                link = result.get('link', '')
                if link:
                    extracted = tldextract.extract(link)
                    domain = f"{extracted.domain}.{extracted.suffix}"
                    if domain:
                        domains[domain].append(query)

        result = sc.render_output(domains)
        return jsonify(result), 200

    except Exception as e:
        logging.error(f"Error in predict route: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)