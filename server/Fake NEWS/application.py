from flask import Flask, request, jsonify
import numpy as np 
import pandas as pd
from ML.helperML import get_features, get_classes, load_model
from News_Scrapper.newsWebScrap import getNews

model= None
application = Flask(__name__)

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
    newsPost= getNews(reqURL)
    r=jsonify({'result':newsPost})
    r.headers.add('Access-Control-Allow-Origin', '*')           #to solve cross origin request problem, modify this in future
    return r



if __name__=='__main__':
    
    model= load_model()
    application.debug= False
    application.run(port= 8091, host="0.0.0.0")