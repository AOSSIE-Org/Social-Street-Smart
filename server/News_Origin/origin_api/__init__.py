from flask import Flask
import os
from flask_cors import CORS, cross_origin
# import logging
# from logging.handlers import RotatingFileHandler
from flask_swagger_ui import get_swaggerui_blueprint
import nltk
nltk.download('punkt')
nltk.download('maxent_ne_chunker')
nltk.data.path = ['origin_api/nltk_data']
# initialize the log handler
# logHandler = RotatingFileHandler('info.log', maxBytes=1000, backupCount=1)
    
# set the log handler level
# logHandler.setLevel(logging.INFO)

app = Flask(__name__)
###logger specific ###
# app.logger.setLevel(logging.INFO)
# app.logger.addHandler(flask logHandler) 	
app.config.from_object('config')
# app.logger.setLevel(logging.INFO)
# app.logger.addHandler(logHandler)
 


## swagger specific ###
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Social Street Smart - News Origin"
    }
)



# app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)
cors = CORS(app)
from origin_api import routes

