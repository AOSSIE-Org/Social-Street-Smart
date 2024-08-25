import numpy as np
from ML.preprocess import Preprocess
from tqdm import tqdm
from os import path

# Local path to the GloVe embeddings file
SAVED_MODEL_FILE_NAME = 'ML/glove.6B.100d.txt'

class Embed:

    def __init__(self):
        print("Loading GloVe 100-D embeddings...")
        self.glove_dict = dict()

        # Load embeddings from the local file
        with open(SAVED_MODEL_FILE_NAME, encoding="utf8") as f:
            for line in f:
                values = line.split()
                word = values[0]
                coefs = np.asarray(values[1:], dtype='float32')
                self.glove_dict[word] = coefs

        print("Embeddings loaded.")

    def sent_embed(self, Y):
        c = 0
        Y = Y.split()
        feature = np.zeros((len(Y), 100), dtype=object)
        for wrd in Y:
            if wrd in self.glove_dict:
                feature[c] = self.glove_dict[wrd].reshape(1, 100)
            else:
                feature[c] = np.zeros((1, 100))
            c += 1
        res = np.mean(feature, axis=0)
        return res

    def make_sentence_embed(self, X, _clean=True):
        if type(X) != list:
            X = [X]
        self.clean_text = _clean
        self.text = X
        if self.clean_text:
            p = Preprocess()
            p.preprocseesData(self.text)
            self.text = p.processedData
        self.embeddingMatrix = []
        for x in tqdm(self.text):
            self.embeddingMatrix.append(self.sent_embed(x))
        self.embeddingMatrix = np.array(self.embeddingMatrix, dtype=float)
