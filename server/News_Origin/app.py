from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
import nltk
import json
import os
import re
from collections import defaultdict

# Import the module correctly
from origin_analyze import SourceChecker # type: ignore

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

# Setting NLTK data path
nltk.data.path = ['origin_api/nltk_data']

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/pred', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        text = request.form['text']
    else:
        text = request.args.get('text')
        key = request.args.get('key')

    if not key or len(key) != 39:
        key = "Your-Default-API-Key"

    language = 'english'
    sc = SourceChecker(text, language, key)
    queries = sc.get_queries()
    domains = sc.get_urls(queries)
    sc.load_domains()
    result = sc.render_output(domains)

    return jsonify(result), 200

if __name__ == '__main__':
    app.run(debug=True)
