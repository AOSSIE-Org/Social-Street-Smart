from ML.preprocess import Preprocess
import numpy as np
from tqdm import tqdm
class HandFeatures(Preprocess):

    def __init__(self):
        Preprocess.__init__(self)
        self.features= []
        self.headlines= []
        self.body= []
        self.featureMatrix= []
    

    def word_overlap_features(self,headline, body):
    # common word/ total word
        clean_headline = self.clean(headline)
        clean_body = self.clean(body)
        clean_headline = self.get_tokenized_lemmas(clean_headline)
        clean_body = self.get_tokenized_lemmas(clean_body)
        feature = len(set(clean_headline).intersection(clean_body)) / float(len(set(clean_headline).union(clean_body)))
        self.features.append(feature)
        
    def ngrams(self, input, n):
        input = input.split(' ')
        output = []
        for i in range(len(input) - n + 1):
            output.append(input[i:i + n])
        return output
    
 
    def append_ngrams(self, text_headline, text_body, size):
        grams = [' '.join(x) for x in self.ngrams(text_headline, size)]
        grams_hits = 0
        grams_early_hits = 0
        for gram in grams:
            if gram in text_body:
                grams_hits += 1
            if gram in text_body[:255]:
                grams_early_hits += 1
        self.features.append(grams_hits)
        self.features.append(grams_early_hits)

    def chargrams(self,input, n):
        output = []
        for i in range(len(input) - n + 1):
            output.append(input[i:i + n])
        return output
    
    def append_chargrams(self, text_headline, text_body, size):
        grams = [' '.join(x) for x in self.chargrams(" ".join(self.remove_stopwords(text_headline.split())), size)]
        grams_hits = 0
        grams_early_hits = 0
        grams_first_hits = 0
        for gram in grams:
            if gram in text_body:
                grams_hits += 1
            if gram in text_body[:255]:
                grams_early_hits += 1
            if gram in text_body[:100]:
                grams_first_hits += 1
        self.features.append(grams_hits)
        self.features.append(grams_early_hits)
        self.features.append(grams_first_hits)
        
    def binary_co_occurence(self,headline, body):
        # Count how many times a token in the title
        # appears in the body text.
        bin_count = 0
        bin_count_early = 0
        for headline_token in self.clean(headline).split(" "):
            if headline_token in self.clean(body):
                bin_count += 1
            if headline_token in self.clean(body)[:255]:
                bin_count_early += 1
        self.features=self.features+ [bin_count, bin_count_early]

    def binary_co_occurence_stops(self, headline, body):
        # Count how many times a token in the title
        # appears in the body text. Stopwords in the title
        # are ignored.
        bin_count = 0
        bin_count_early = 0
        for headline_token in self.remove_stopwords(self.clean(headline).split(" ")):
            if headline_token in self.clean(body):
                bin_count += 1
                bin_count_early += 1
        self.features=self.features+ [bin_count, bin_count_early]

    def calculate_polarity(self, _refuting_words, text):
            return sum([t in _refuting_words for t in text])%2
    
    
    def polarity_refuting_features(self,headline, body):
        _refuting_words = [
            'fake',
            'fraud',
            'hoax',
            'false',
            'deny', 'denies',
            'refute',
            'not',
            'despite',
            'nope',
            'doubt', 'doubts',
            'bogus',
            'debunk',
            'pranks',
            'retract'
        ]
        clean_headline = self.clean(headline)
        clean_headline = self.get_tokenized_lemmas(clean_headline)
        clean_body = self.clean(body)
        clean_body= self.get_tokenized_lemmas(clean_body)
        feature=0
        for wrd in clean_headline:
            if wrd in _refuting_words:
                feature=1
        self.features.append(feature)
        self.features.append(self.calculate_polarity(_refuting_words, clean_headline))
        self.features.append(self.calculate_polarity(_refuting_words, clean_body))



    def make_hand_features(self, headlines_,body_):
        if(type(headlines_)!= list):
            headlines_= [headlines_]
        if(type(body_)!=list):
            body_=[body_]
        self.headlines= headlines_
        self.body= body_
        self.featureMatrix=[]
       
        for i, (headline, body) in tqdm(enumerate(zip(self.headlines , self.body))):
            clean_body = self.clean(body)
            clean_headline = self.clean(headline)
            self.features=[]
            self.append_chargrams(clean_headline, clean_body, 2)
            self.append_chargrams(clean_headline, clean_body, 8)
            self.append_chargrams(clean_headline, clean_body, 4)
            self.append_chargrams(clean_headline, clean_body, 16)
            self.append_ngrams( clean_headline, clean_body, 2)
            self.append_ngrams( clean_headline, clean_body, 3)
            self.append_ngrams( clean_headline, clean_body, 4)
            self.append_ngrams( clean_headline, clean_body, 5)
            self.append_ngrams( clean_headline, clean_body, 6)
            self.word_overlap_features(headline, body)
            self.binary_co_occurence(headline,body)
            self.binary_co_occurence_stops(headline,body)
            self.polarity_refuting_features(headline,body)
            self.featureMatrix.append(self.features)

        self.featureMatrix= np.array(self.featureMatrix)

    
        

    


