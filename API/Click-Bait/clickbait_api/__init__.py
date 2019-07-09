from flask import Flask
import os
from flask_cors import CORS, cross_origin


app = Flask(__name__)
app.config.from_object('config')
cors = CORS(app)

from clickbait_api import routes
