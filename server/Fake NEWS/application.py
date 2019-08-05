import os
from os.path import join, dirname
from dotenv import load_dotenv
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

import numpy as np 
import pandas as pd

from ML.helperML import get_features, get_classes, load_model
from News_Scrapper.newsWebScrap import getNews

model= None
application = Flask(__name__)

application.config.from_object(os.getenv('APP_SETTINGS'))
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(application)

from DB.newsDB import allnewsDB

@application.route('/predict', methods= ['POST'])
def predict():
    global model
    if model==None:
        print( "error in loading trained model\n")
        exit
    query= request.json
    query_body= query['body']
    query_head= query['head']
    feat= get_features(query_head, query_body)
    prediciton = model.predict(feat)
    class_= get_classes(prediciton)
    r=jsonify({'prediciton': class_})
    r.headers.add('Access-Control-Allow-Origin', '*')           #to solve cross origin request problem, modify this in future
    return r
    
@application.route('/scrap', methods=['POST'])
def scrap():
    req= request.json
    reqURL= req['url']
    newsPost=allnewsDB.query.get(reqURL).serialize()
    if newsPost== None :
        print("not found in db")
        x= getNews(reqURL)
        newsPost= allnewsDB(link= x['url'],content= x['title']+ x['description'],source= x['source_domain'],dateTime= x["date_publish"])
        db.session.add(newsPost)
        db.session.commit()
    else:
        print("found in db")
    r=jsonify({'result': newsPost})
    r.headers.add('Access-Control-Allow-Origin', '*')           #to solve cross origin request problem, modify this in future
    return r


model= load_model()

if __name__=='__main__':
    
    application.debug= False
    application.run(port= 8091, host="0.0.0.0")