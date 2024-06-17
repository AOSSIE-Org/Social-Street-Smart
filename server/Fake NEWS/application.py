import os
from os.path import join, dirname
from dotenv import load_dotenv
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

import numpy as np 
import pandas as pd

#auth news scheduler
# pip install apscheduler
import time
import atexit
from News_Scrapper.authNS import authNewsScraper
from apscheduler.schedulers.background import BackgroundScheduler
scheduler = BackgroundScheduler()


from ML.helperML import get_features, get_classes, load_model
from News_Scrapper.newsWebScrap import getNews

model= None
application = Flask(__name__)

application.config.from_object(os.getenv('APP_SETTINGS'))
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(application)

from DB.newsDB import allnewsDB
from DB.newsDB import authenticNewsDB
from Cache.resultCache import fbCache, tweetCache, newsCache

# -------auth news scrapper fucntion-----------
def authNewsScrapMain():
    print("scheduled auth news scrapping started")
    newsList= authNewsScraper()
    for news in newsList:
        url= news['link']
        x=authenticNewsDB.query.get(url)
        if(x==None):
            newNews= authenticNewsDB(link= news['link'], source= news['source'], dateTime= news['dateTime'], content= news['content'])
            xNewsNews= allnewsDB(link= news['link'], source= news['source'], dateTime= news['dateTime'], content= news['content'])
            db.session.add(newNews)
            db.session.commit()
            db.session.add(xNewNews)
            db.session.commit()
        else:
            print("found in DB")
    
scheduler.add_job(func=authNewsScrapMain, trigger="interval", seconds=0, minutes= 240)
scheduler.start()
# Shut down the scheduler when exiting the app
atexit.register(lambda: scheduler.shutdown())

#--------------end-----------

#---- functions for prediction of query-------


def getNewsContent(reqURL):
    newsPost= allnewsDB.query.get(reqURL)
    if newsPost== None :
        # print("not found in db")
        x= getNews(reqURL)
        newsPost= allnewsDB(link= x['url'],content= x['title']+ x['description'],source= x['source_domain'],dateTime= x["date_publish"])
        db.session.add(newsPost)
        db.session.commit()
    else:
        print("found in db")
    newsPost= newsPost.serialize()
    return newsPost

def get_prediction(h,b):
    global model
    if model==None:
        print( "error in loading trained model\n")
        exit
    feat= get_features(h,b)
    prediction= model.predict(feat)
    class_= get_classes(prediction)
    return class_

def fb_query(query):
    findDB= fbCache.query.get(query['fbID'])
    result= "unknown"
    if findDB== None: # result not found in DB
        query_content = query['content']
        allauthNews= authenticNewsDB.query.all() #find in db list 
        for news in allauthNews:
            news= news.serialize() 
            pred= get_prediction(query_content,news['content'])
            if pred== "disagree":
                result= "fake"
                break
            elif pred== "agree":
                result= "genuine"
                break
        resultCard= fbCache(fbID= query['fbID'], sourcePage= query['sourcePage'], dateTime= query['dateTime'], result= result)
        db.session.add(resultCard)
        db.session.commit()
    else:
        result= findDB.serialize()['result']
    return result

def twitter_query(query):
    findDB= tweetCache.query.get(query['tweetID'])
    result= "unknown"
    if findDB== None: # result not found in DB
        query_content = query['content']
        allauthNews= authenticNewsDB.query.all() #find in db list
        for news in allauthNews:
            news= news.serialize()
            pred= get_prediction(query_content,news['content'])
            if pred== "disagree":
                result= "fake"
                break
            elif pred== "agree":
                result= "genuine"
                break
        resultCard= tweetCache(tweetID= query['tweetID'], sourceHandle= query['handle'], dateTime= query['dateTime'], result= result)
        db.session.add(resultCard)
        db.session.commit()
    else:
        result= findDB.serialize()['result']
    return result

def newsWeb_query(query):
    findDB= newsCache.query.get(query['link'])
    result= "unknown"
    if findDB== None: # result not found in DB
        query_content = query['content']
        allauthNews= authenticNewsDB.query.all() #find in db list
        for news in allauthNews:
            news= news.serialize()
            pred= get_prediction(query_content,news['content'])
            if pred== "disagree":
                result= "fake"
                break
            elif pred== "agree":
                result= "genuine"
                break
        resultCard= newsCache(link= query['link'], source= query['source'], dateTime= query['dateTime'], result= result)
        db.session.add(resultCard)
        db.session.commit()
    else:
        result= findDB.serialize()['result']
    return result


@application.route('/predict', methods= ['POST'])
def predict():
    query= request.json
    query_body= query['body']
    query_source= query['source']
    result= None
    if query_source== "FB" :
        result= fb_query(query_body)
    elif query_source == "Twitter":
        result = twitter_query(query_body)
    elif query_source == "newsWeb":
        query_body= getNewsContent(query_body['link'])
        result = newsWeb_query(query_body)
    else:
        print("error in finding source of query")

    r=jsonify({'prediciton': result})
    r.headers.add('Access-Control-Allow-Origin', '*')           #to solve cross origin request problem, modify this in future
    return r

#----------------end------------------------------------

model= load_model()

if __name__=='__main__':
    # only for API testing without API_manager 
    application.debug= False
    application.run(port= 8091, host="0.0.0.0")