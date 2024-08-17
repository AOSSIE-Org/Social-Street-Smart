from flask import Flask, request, jsonify
import numpy as np

from ML.helperML import get_features, get_classes, loadLite

app = Flask(__name__)

interpreter = loadLite()

def get_prediction(h,b):
    global interpreterd
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


def getQueryResults(query,relatedArticles):
    result= "unknown"

    for news in relatedArticles:

        #remove website names from news
        news = news.rsplit(' - ',1)[0]
        
        pred= get_prediction(query,news)
        if pred== "disagree":
            result= "fake"
            break
        elif pred== "agree":
            result= "genuine"
            break
        
    return result

@app.route('/', methods = ['GET'])
def root():
    return "Welcome this API is working now"

@app.route('/predict', methods= ['POST'])
def predict():
    query = request.json['query']
    relatedArticles = request.json['relatedArticles']
    
    result = getQueryResults(query,relatedArticles)

    r=jsonify({'prediciton': result})
    r.headers.add('Access-Control-Allow-Origin', '*')     #to solve cross origin request problem, modify this in future
    return r

app.run(port = 5000,debug=True)

