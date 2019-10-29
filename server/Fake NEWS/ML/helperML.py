import numpy as np 
import pandas as pd
from keras.models import model_from_json 
from ML.glove_embeddings import Embed
from ML.handFeature import HandFeatures


embeddingFilePath= r'files/glove.6B.100d.txt'
modelDescPath= r'ML/model_FNC.json' #model description json path
modelWeightPath= r'ML/weights-improvement-04-0.85.hdf5' #model wieths path
hf= HandFeatures()
embed_= Embed(embeddingFilePath)

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


def get_features(headline, body):
    global embed_
    if embed_ ==None:
        print("error in loading embedding\n")
        exit
    hf.make_hand_features(headline,body)
    handFeat= hf.featureMatrix
    embed_.make_sentence_embed(headline)
    headGlovefeat= embed_.embeddingMatrix
    embed_.make_sentence_embed(body)
    bodyGloveFeat= embed_.embeddingMatrix
    feature= np.concatenate((headGlovefeat,bodyGloveFeat,handFeat),axis=-1)
    return feature

def load_model():
    global modelDescPath, modelWeightPath
    json_file= open(modelDescPath,'r')
    model_des= json_file.read()
    json_file.close()
    loaded_model= model_from_json(model_des)
    loaded_model.load_weights(modelWeightPath)
    loaded_model._make_predict_function() #don't remove this untill this bug is solved officially
    return loaded_model



    
    