# tested
from selenium import webdriver
from bs4 import BeautifulSoup
# sudo apt-get install chromium-chromedriver
# do this to install chromium
options = webdriver.ChromeOptions()
options.add_argument('--ignore-certificate-errors')
options.add_argument('--headless')
from News_Scrapper.newsWebScrap import getNews
import time


