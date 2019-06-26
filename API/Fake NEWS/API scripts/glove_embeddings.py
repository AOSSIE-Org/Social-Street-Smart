from gensim.models import Word2Vec
from gensim.models import KeyedVectors
import string
import numpy as np
from preprocess import Preprocess
from tqdm import tqdm
import wget

class Embed:

    def __init__(self, embedFilePath):
        if embedFilePath==None:
            print("enter embedding path")
            exit
        if(path.exists(embedFilePath)== False):
            print("downloading glove")
            embedFilePath= wget.download("https://adnlp.s3.ap-south-1.amazonaws.com/glove.6B.100d.txt")
            print("glove downloaded")
        print("glove 100-D embeddings loading.....")
        self.glove_dict = dict()
        f = open(embedFilePath,encoding="utf8")
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
        

        


