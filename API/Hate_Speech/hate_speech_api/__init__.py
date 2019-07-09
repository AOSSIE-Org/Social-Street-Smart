from flask import Flask
import os
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config.from_object('config')

#app.config['SECRET_KEY'] = 'b6256da821325782f664b0af78bba330'
cors = CORS(app)
#app.config['CORS_HEADERS'] = 'Content-Type'

from hate_speech_api import routes

