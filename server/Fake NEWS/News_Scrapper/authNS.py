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

def scrap_Thindu(hindu_url="https://www.thehindu.com/news/international/"):
    print("schduled scraping from the hindu")
    d2= webdriver.Chrome("/usr/lib/chromium-browser/chromedriver", chrome_options=options)
    d2.get(hindu_url)
    print("loading hindu loaded")
    hindu_page_source= d2.page_source
    hsoup = BeautifulSoup(hindu_page_source, 'lxml')
    hfeeds= hsoup.find_all('div', class_= 'Other-StoryCard')
    h_url_li= []
    for x in hfeeds:
        h_url_li.append(x.find("a")["href"])
    return h_url_li


