
import numpy as np
from ML.preprocess import Preprocess
from tqdm import tqdm
from os import path
import wget
import boto3
import botocore


BUCKET_NAME = 'fakenewsml-dev-serverlessdeploymentbucket-c949nmsfqdh6'
MODEL_FILE_NAME ='glove.6B.100d.txt'
SAVED_MODEL_FILE_NAME ='ML/glove.6B.100d.txt'
# APP_ROOT=os.path.dirname(os.path.abspath(__file__))

def downloadGlove():
    s3=boto3.resource('s3', region_name='us-east-1')
    try:
        s3.Bucket(BUCKET_NAME).download_file(MODEL_FILE_NAME,SAVED_MODEL_FILE_NAME)
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "404":
            print("The Object doesnot exist")
        else:
            raise


class Embed:

    def __init__(self, embedFilePath):
        if embedFilePath==None:
            print("enter embedding path")
            exit
        # if(path.exists(embedFilePath)== False):
        if(path.exists(SAVED_MODEL_FILE_NAME)== False):
            downloadGlove()
        #     print("downloading glove")
        #     embedFilePath= wget.download("https://adnlp.s3.ap-south-1.amazonaws.com/glove.6B.100d.txt", out= embedFilePath)
        #     print("glove downloaded")
        print("glove 100-D embeddings loading.....")
        self.glove_dict = dict()
        # f = open(embedFilePath,encoding="utf8")
        f = open(SAVED_MODEL_FILE_NAME,encoding="utf8")
        for line in f:
            values = line.split()
            word = values[0]
            coefs = np.asarray(values[1:], dtype='float32')
            self.glove_dict[word] = coefs
        f.close()

        print("embeddings loaded")
        

    def sent_embed(self, Y):
        c=0
        Y= Y.split()
        feature= np.zeros((len(Y),100),dtype= object)
        for wrd in Y:
            if wrd in self.glove_dict:
                feature[c]=self.glove_dict[wrd].reshape(1,100)
            else:
                feature[c]= np.zeros((1,100))
            c=c+1
        res= np.mean(feature,axis=0)
        return res

    def make_sentence_embed(self,X, _clean=True):
        if(type(X)!= list):
            X= [X]
        self.clean_text= _clean
        self.text= X
        if(self.clean_text):
            p= Preprocess()
            p.preprocseesData(self.text)
            self.text= p.processedData
        self.embeddingMatrix= []
        for x in tqdm(self.text):
            self.embeddingMatrix.append(self.sent_embed(x))
        self.embeddingMatrix= np.array(self.embeddingMatrix,dtype= float)
        

        


