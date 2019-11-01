import os
import re
import nltk
import string
import numpy as np
from sklearn import feature_extraction
from tqdm import tqdm

_wnl = nltk.WordNetLemmatizer()
class Preprocess:
    def __init__(self, lower=True, remove_stop=True):
        self.rawData= []
        self.processedData=[]
        self._remove_stop= remove_stop
        self.lowercase= lower



 
    def join_tok(self, text):
        return " ".join(text)

    def normalize_word(self,w):
        return _wnl.lemmatize(w).lower()


    def get_tokenized_lemmas(self,s):
        return [self.normalize_word(t) for t in nltk.word_tokenize(s)]


    def clean(self,text):
        # Cleans a string: Lowercasing, trimming, removing non-alphanumeric
        text = text.translate(str.maketrans(string.punctuation, ' '*len(string.punctuation),''))
        if(self.lowercase):
            return " ".join(re.findall(r'\w+', text, flags=re.UNICODE)).lower()
        else:
            return text


    def remove_stopwords(self,l):
        # Removes stopwords from a list of tokens
        return [w for w in l if w not in feature_extraction.text.ENGLISH_STOP_WORDS]

    
    def preprocseesData(self, X):
        self.rawData= X    
        for text in tqdm(self.rawData):
            text= self.clean(text)
            text= self.get_tokenized_lemmas(text)
            if(self._remove_stop):
                text= self.remove_stopwords(text)
            text= self.join_tok(text)
            self.processedData.append(text)

    



