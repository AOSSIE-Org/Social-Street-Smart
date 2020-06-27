import os
from os.path import join, dirname
from dotenv import load_dotenv
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)
import json
import decimalencoder

from flask import Flask, request, jsonify
# from flask_sqlalchemy import SQLAlchemy
# from newsWebScrap import getNews
#auth news scheduler
# pip install apscheduler
import time
import atexit
import hashlib
import numpy as np
# from News_Scrapper.authNS import authNewsScraper
# from apscheduler.schedulers.background import BackgroundScheduler
# scheduler = BackgroundScheduler()

from ML.helperML import get_features, get_classes, loadLite
# from News_Scrapper.newsWebScrap import getNews

getNewsURL = 'https://0nb874owq6.execute-api.us-east-1.amazonaws.com/dev/fakenews/getNews/'

interpreter= None
# model= None
application = Flask(__name__)
import requests
import base64
# DynamoDB Specific
import boto3
import os
dynamodb = boto3.resource('dynamodb')
allTable = dynamodb.Table(os.environ['ALL_TABLE'])
authTable = dynamodb.Table(os.environ['AUTH_TABLE'])

# Get News Function using the endpoint at the newsScraper

def getNews(url):
    encodedurl = base64.b64encode(bytes(url, 'utf-8')) # Convert to byte type and then to base64 for passing in the URL
    encodedurl = str(encodedurl)[2:-1]  # Keep relevant part
    r = requests.get(getNewsURL + encodedurl)
    return r.json()

#---- functions for prediction of query-------


def getNewsContent(reqURL):
    # newsPost= allnewsDB.query.get(reqURL)
    # print("CHECKING")
    newsPost = None
    # try:
    #     newsPost= allTable.get_item(
    #         Key = {
    #             'id' : hashlib.md5(bytes(reqURL, 'utf-8')).hexdigest() # MD5 of the URL is used as the id
    #         }
    #     )
    # except:
    #     newsPost = None
    if newsPost == None :
        # print("not found in db")
        x = getNews(reqURL)
        # x = 'test'
        # allTable.put_item(x)
        newsPost = x
    else:
        print("found in db")
    # newsPost= newsPost.serialize()
    # newsPost = newsPost['description']
    print(newsPost)
    # return json.dumps(newsPost['Item'], cls=decimalencoder.DecimalEncoder)
    return newsPost

def get_prediction(h,b):
    global interpreter
    if interpreter==None:
        print( "error in loading trained model\n")
        exit
    feat= get_features(h,b)

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    input_data = np.array(feat, dtype=np.float32)
    interpreter.set_tensor(input_details[0]['index'], input_data)
    
    interpreter.invoke()

    output_data = interpreter.get_tensor(output_details[0]['index'])
    class_ = get_classes(output_data)

    return class_


def social_query(query):
    # findDB= tweetCache.query.get(query['tweetID'])
    findDB= None
    result= "unknown"
    # print(query)

    if findDB== None: # result not found in DB
        query_content = query['content']
        allDBEntries = authTable.scan()
        for news in allDBEntries['Items']:
            # print(news)
            pred= get_prediction(query_content,news['content'])
            if pred== "disagree":
                result= "fake"
                break
            elif pred== "agree":
                result= "genuine"
                break
        
    return result

def newsWeb_query(query):
    # findDB= newsCache.query.get(query['link'])
    findDB = None
    result= "unknown"
    if findDB== None: # result not found in DB
        query_content = query['description']
        allDBEntries = authTable.scan()
        # allauthNews= authenticNewsDB.query.all() #find in db list
        for news in allDBEntries['Items']:
            # news= news.serialize()
            # print(news)
            pred= get_prediction(query_content,news['content'])
            if pred== "disagree":
                result= "fake"
                break
            elif pred== "agree":
                result= "genuine"
                break
        # resultCard= newsCache(link= query['link'], source= query['source'], dateTime= query['dateTime'], result= result)
        # authTable.put_item(resultCard)
    # else:
        # result= findDB.serialize()['result']
    return result


@application.route('/', methods=['GET'])
def index():
    return "AOSSIE's Fake News API for Social Street Smart"

@application.route('/predict', methods= ['POST'])
def predict():
    query= request.json
    query_body= query['body']
    query_source= query['source']
    result= 'Could not verify / find the source of the query'
    if query_source== "FB" :
        result= social_query(query_body)
    if query_source == "Twitter":
        result = social_query(query_body)
    if query_source == "newsWeb":
        query_body= getNewsContent(query_body['link'])
        result = newsWeb_query(query_body)
    else:
        print("error in finding source of query")

    r=jsonify({'prediciton': result})
    r.headers.add('Access-Control-Allow-Origin', '*')           #to solve cross origin request problem, modify this in future
    return r

#----------------end------------------------------------

# model= load_model ()
interpreter = loadLite()

if __name__=='__main__':
    # only for API testing without API_manager 
    # application.debug= False
    # application.run(port= 8091, host="0.0.0.0")
    application.run()