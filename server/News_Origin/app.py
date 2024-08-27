import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
import nltk
import re
from collections import defaultdict
from pattern.en import ngrams
from pattern.web import Google
from nltk.corpus import stopwords
from nltk import ne_chunk, pos_tag
import pandas as pd
from dotenv import load_dotenv
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger_eng')
nltk.download('punkt_tab')
nltk.download('wordnet')
nltk.download('maxent_ne_chunker')
nltk.download('maxent_ne_chunker_tab')
nltk.download('stopwords')
nltk.download('words')

# Load environment variables from .env file
load_dotenv()

# Environment variables
NLTK_DATA_PATH = os.getenv('NLTK_DATA_PATH')
API_KEY = os.getenv('API_KEY')

# Set NLTK data path
# nltk.data.path = [NLTK_DATA_PATH]

app = Flask(__name__)
app.config['TESTING'] = True
app.debug = True

# Swagger configuration
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={'app_name': "Social Street Smart - News Origin"}
)
app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)

# CORS configuration
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/pred', methods=['GET', 'POST'])
def predict():
    text = request.args.get('text') if request.method == 'GET' else request.form.get('text')
    key = request.args.get('key', API_KEY)

    if not key or len(key) != 39:
        key = API_KEY

    sc = SourceChecker(text, 'english', key)
    queries = sc.get_queries()
    domains = sc.get_urls(queries)
    sc.load_domains()
    result = sc.render_output(domains)

    return jsonify(result), 200

class SourceChecker:
    def __init__(self, text, language, key, max_queries=8, span=8, threshold=0.7):
        self.text = text
        self.language = language
        self.key = key
        self.max_queries = max_queries
        self.span = span
        self.threshold = threshold
        self.cat_dict = defaultdict(list)
        self.engine = Google(license=key, throttle=0.8, language=None)

    def get_queries(self):
        """Extract search queries from the text."""
        text = self.text.replace('--', 'DOUBLEDASH')
        all_ngrams = ngrams(text, n=self.span, punctuation="", continuous=True)

        stop_words = stopwords.words(self.language) if self.language in stopwords.fileids() else []
        queries = []

        for ngram in all_ngrams:
            stop_score = sum([w in stop_words for w in ngram]) / len(ngram)
            ent_score = 0

            if self.language == 'english':
                chunked = ne_chunk(pos_tag(ngram))
                named_entities = [chunk for chunk in chunked if isinstance(chunk, nltk.Tree)]
                ent_score = len(named_entities) / len(ngram)

            if stop_score < self.threshold and ent_score < self.threshold:
                r_string = self.reconstruct_ngram(ngram)
                if r_string in self.text:
                    queries.append(r_string)

        reduction = len(queries) // self.max_queries
        return queries[:len(queries):reduction] if reduction else queries

    def reconstruct_ngram(self, ngram):
        """Reconstruct original substrings from the ngrams."""
        punc_b = ['!', '?', '.', ',', ';', ':', '\'', ')', ']', '}']
        punc_a = ['(', '[', '}', '$']
        ngram = ' '.join(ngram)
        for p in punc_b:
            ngram = ngram.replace(' ' + p, p)
        for p in punc_a:
            ngram = ngram.replace(p + ' ', p)
        ngram = re.sub('(^| )BEGQ', ' "', ngram)
        ngram = re.sub('ENDQ($| )', '" ', ngram)
        return ngram.replace('DOUBLEDASH', '--')

    def load_domains(self):
        """Load domain information from CSV using pandas."""
        sources_path = 'origin_api/static/data/news_websites.csv'
        df = pd.read_csv(sources_path)
        for index, row in df.iterrows():
            url = row[2]
            cats = "".join(str(row[3]))
            self.cat_dict[url] = cats

    def get_urls(self, queries):
        """Run search queries through Google API and collect returned domain information."""
        domains = defaultdict(list)
        for q in queries:
            results = self.engine.search(f'"{q}"')
            for result in results:
                domain = self.get_domain(result.url)
                domains[domain].append(q)
        return domains

    def get_domain(self, full_url):
        """Extract the domain name from the URL."""
        clean_reg = re.compile(r'^((?:https?:\/\/)?(?:www\.)?).*?(\/.*)?$')
        match = re.search(clean_reg, full_url)
        return str.replace(str.replace(full_url, match.group(1), ''), match.group(2), '')

    def render_output(self, domains):
        """Render text output."""
        output = defaultdict(list)
        for d, v in domains.items():
            d_cats = [c for c in self.cat_dict[d] if len(c) > 0 and len(c.split(' ')) < 3]
            overlap = len(v) / self.max_queries
            if 0.2 < overlap < 0.4:
                output['MINIMAL'].append((d, "".join(d_cats)))
            elif 0.4 < overlap < 0.6:
                output['SOME'].append((d, "".join(d_cats)))
            elif overlap >= 0.6:
                output['HIGH'].append((d, "".join(d_cats)))

        for deg in ['HIGH', 'SOME', 'MINIMAL']:
            if output[deg]:
                print(f'{deg} OVERLAP:')
                for d, cats in sorted(output[deg]):
                    print(f'{d}: {cats if cats else ""}')
                print('\n')

        return output

if __name__ == '__main__':
    app.run(debug=True, port=5000)
