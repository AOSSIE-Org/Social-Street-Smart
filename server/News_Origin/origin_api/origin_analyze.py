
from pattern.en import ngrams
from pattern.web import Google, SEARCH
from pattern.db import Datasheet
from pattern.db  import pd
from collections import defaultdict
import csv
import string
import collections
import re
import random
import nltk
from nltk.corpus import stopwords
from nltk import ne_chunk, pos_tag, word_tokenize
from pattern.graph import Graph
import itertools
import sys
nltk.data.path = ['origin_api/nltk_data']


class SourceChecker(object):

	def __init__(self, text, language, key, max_queries = 8, span = 8, threshold = .7):
		self.max_queries = max_queries
		self.span = span
		self.threshold = threshold
		self.text = text
		self.language = language
		self.cat_dict = defaultdict(list)
		self.engine = Google(license=key, throttle=0.8, language=None)

	def get_queries(self):

		"""Function to extract search queries from the text: 
		breaks text into ngrams, filters ngrams that consist mostly of stopwords or named entities, 
		selects an evenly spaced sample of the remaining ngrams"""

		text = self.text
		beg_quotes = re.findall(r'\"\S', text)
		#print beg_quotes


		for each in beg_quotes:
			text = text.replace(each, 'BEGQ' + each[-1])

		end_quotes = re.findall(r'\S\"', text)
		for each in end_quotes:
			text = text.replace(each, each[0] + 'ENDQ')

		text = re.sub('(ENDQ)+', 'ENDQ', text)
		text = re.sub('(BEGQ)+', 'BEGQ', text)
		text = text.replace('--', 'DOUBLEDASH')
		#print text
		all_ngrams = ngrams(text, n = self.span, punctuation = "", continuous = True)

		if self.language in stopwords.fileids():
			stop_words = stopwords.words(self.language)
		else:
			stop_words = []	
		queries = []
		for ngram in all_ngrams:
			num_stop = len([w for w in ngram if w in stop_words])
			stop_score = float(num_stop)/len(ngram)

			if self.language == 'english':
				chunked = ne_chunk(pos_tag(ngram))
				named_entities = [[w for w, t in elt] for elt in chunked if isinstance(elt, nltk.Tree)]
				num_ent = sum([len(ent_list) for ent_list in named_entities])
				ent_score = float(num_ent)/len(ngram)
			else:
				ent_score = 0

			if stop_score < self.threshold and ent_score < self.threshold:
				r_string = self.reconstruct_ngram(ngram)
				if r_string in self.text:
					queries.append(r_string)

		reduction = len(queries)/self.max_queries
		print (reduction)
		print (queries)

		return queries
		
	def reconstruct_ngram(self, ngram):

		"""Function to reconstruct original substrings from the ngrams"""

		punc_b = ['!', '?', '.', ',', ';', ':', '\'', ')', ']', '}']
		punc_a = ['(', '[', '}', '$']
		ngram = ' '.join(ngram)
		for p in punc_b:
			ngram = ngram.replace(' '+p, p)
		for p in punc_a:
			ngram = ngram.replace(p+' ', p)
		ngram = re.sub('(^| )BEGQ', ' "', ngram)
		ngram = re.sub('ENDQ($| )', '" ', ngram)
		ngram = ngram.replace('DOUBLEDASH', '--')
		return ngram 

	def load_domains(self):
		"""loads domain information"""
		sources_path = 'origin_api/static/data/news_websites.csv'
		domain_file = Datasheet.load(sources_path, headers = True)
		for row in domain_file:
			url  = row[2]
			cats = row[3]
			cats = "".join(cats)
			#print (cats)
			self.cat_dict[url] = cats


	def pairwise(self, t):
		it = iter(t)
		return zip(it,it)

	def get_urls(self, queries):
		"""runs search query through search API and collects returned domain information"""
		domains = defaultdict(list)
		for q in queries:
			q = "\"" + q + "\""
			results = self.engine.search(q)

			for result in results:			
				url = result.url
				domain = self.get_domain(url)
				domains[domain].append(q)

		return domains



	def get_domain(self, full_url):
		"""function to extract the domain name from the URL"""
		clean_reg= re.compile(r'^((?:https?:\/\/)?(?:www\.)?).*?(\/.*)?$')
		match = re.search(clean_reg, full_url)
		beg, end = match.group(1), match.group(2)
		domain = str.replace(full_url, beg, '')
		domain = str.replace(domain, end, '')
		return domain



	def render_output(self, domains):
		"""renders text output"""
		output = defaultdict(list)
		for d,v in domains.items():
			d_cats = [c for c in self.cat_dict[d] if len(c)>0 and len(c.split(' '))<3]
			overlap = float(len(v))/self.max_queries
			if 0.2 < overlap < 0.4:
				output['MINIMAL'].append((d, "".join(d_cats)))
			elif 0.4 < overlap < 0.6:
				output['SOME'].append((d, "".join(d_cats)))
			elif overlap >= 0.6:
				output['HIGH'].append((d, "".join(d_cats)))
		degrees = ['HIGH', 'SOME', 'MINIMAL']
		print ('\n')
		for deg in degrees:
			if output[deg]:
				print ('%s OVERLAP: ' % deg)
				for d, cats in sorted(output[deg]):
					if cats:
						print (d + ': ' + ','.join(cats))
					else:
						print (d)
				print ('\n')
		return output


	def render_graph(self, domains):
		"""renders graph output"""
		g = Graph()
		for domain in domains.keys():
			if domain in self.cat_dict:
				categories = self.cat_dict[domain]
				stroke =  (0,0,0,0.5)
				if 'right' in categories:
					stroke = (255, 0, 0, 1)
				elif 'right_center' in categories:
					stroke = (255, 0, 0, .5)
				if 'left' in categories:
					stroke = (0,0,255, 1)
				elif 'left_center' in categories:
					stroke = (0,0,255, .5)
				if 'least_biased' in categories:
					stroke = (0,255,0, 1)

			fill = (128,128,0, 0.1)
			dub_cats = ['fake', 'questionable', 'clickbait', 'unreliable', 'conspiracy']
			score = len([c for c in categories if c in dub_cats])
			if score:
				fill = (0,0,0,float(score)/5)			
			g.add_node(domain, radius = len(domains[domain])*6, stroke = stroke, strokewidth = 6, fill = fill, font_size = 30)

		pairs = self.pairwise(domains.keys())
		for x, y in pairs:
			x_queries = set(domains[x])
			y_queries = set(domains[y])
			intersection = len(x_queries.intersection(y_queries))
			if intersection > 0:
				max_rad = max(len(domains[x]), len(domains[y]))+1000
				g.add_edge(x, y, length = max_rad, strokewidth = intersection)

		path = 'graph'
		g.export(path, encoding='utf-8', distance = 6, directed = False, width = 1400, height = 900)
