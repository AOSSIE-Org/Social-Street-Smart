from flask import Flask, request, jsonify
import numpy as np 
import pandas as pd
from keras.models import model_from_json 
from glove_embeddings import Embed
from handFeature import HandFeatures

model= None
embed_= None
hf= None



application = Flask(__name__)

@application.route('/predict', methods= ['POST'])
def predict():
    global model, embed_
    if model==None:
        print( "error in loading trained model\n")
        exit
    if embed_ ==None:
        print("error in loading embedding\n")
        exit
    query= request.json
    query_body= query['body']
    query_head= query['head']
    feat= get_features(query_head, query_body)
    prediciton = model.predict(feat)
    class_= get_classes(prediciton)
    return jsonify({'prediciton': class_})
    

def get_features(headline, body):
    global embed_
    hf.make_hand_features(headline,body)
    handFeat= hf.featureMatrix
    embed_.make_sentence_embed(headline)
    headGlovefeat= embed_.embeddingMatrix
    embed_.make_sentence_embed(body)
    bodyGloveFeat= embed_.embeddingMatrix
    feature= np.concatenate((headGlovefeat,bodyGloveFeat,handFeat),axis=-1)
    return feature

def get_classes(prediction):
    cls=  prediction.argmax(axis=-1)[0]
    if cls== 0:
        return "agree"
    elif cls== 1:
        return "disagree"
    elif cls== 2:
        return "discuss"
    elif cls== 3:
        return "unrelated"
    
def load_model(fp,weights):
    json_file= open(fp,'r')
    model_des= json_file.read()
    json_file.close()
    loaded_model= model_from_json(model_des)
    loaded_model.load_weights(weights)
    loaded_model._make_predict_function() #don't remove this untill this bug is solved officially
    return loaded_model

if __name__=='__main__':
    embeddingFilePath= 'glove.6b.100d.txt'
    modelDescPath= 'model_FNC.json' #model description json path
    modelWeightPath= 'weights-improvement-04-0.85.hdf5' #model wieths path
    hf= HandFeatures()
    embed_= Embed(embeddingFilePath)
    model= load_model(modelDescPath, modelWeightPath)
    application.debug= True
    application.run()