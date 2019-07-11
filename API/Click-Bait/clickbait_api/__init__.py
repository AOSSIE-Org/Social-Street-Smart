from flask import Flask
import os
from flask_cors import CORS, cross_origin
import logging
from logging.handlers import RotatingFileHandler

# initialize the log handler
logHandler = RotatingFileHandler('info.log', maxBytes=1000, backupCount=1)
    
# set the log handler level
logHandler.setLevel(logging.INFO)

app = Flask(__name__)
app.logger.setLevel(logging.INFO)
app.logger.addHandler(logHandler) 	
app.config.from_object('config')
app.logger.setLevel(logging.INFO)

app.logger.addHandler(logHandler) 


cors = CORS(app)
from clickbait_api import routes

