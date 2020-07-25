import requests
# from newsScrapeAPI import newsWebScrap
# from newsScrapeAPI import app
from scraper.newsWebScrap import getNews
from bs4 import BeautifulSoup
import hashlib



def scrape_theHindu(hindu_url="https://www.thehindu.com/news/international/"):
    print("scheduled scraping from The Hindu")

    news = requests.get(hindu_url)

    if(news.status_code==200):
        soup = BeautifulSoup(news.text)
        feed = soup.find_all('div', class_= 'Other-StoryCard')
        url_li= []
        for x in feed:
            url_li.append(x.find("a")["href"])
        return url_li

def scrape_theWire(wire_url="https://thewire.in/"):
    print("scheduled scraping from The Hindu")

    news = requests.get(wire_url)

    if(news.status_code==200):
        soup = BeautifulSoup(news.text)
        feed = soup.find_all('div',class_='card__title')
        url_li= []
        for x in feed:
            if x.find("a")["href"][0:5]!="https" : # to avoid navigation to other page
                url_li.append(wire_url[:-1]+ x.find("a")["href"])
        return url_li


def getNewsDetails():
    news_url_li= scrape_theHindu()+ scrape_theWire()

    res_list= []
    for url in news_url_li:
        # print(url)
        try:
            x = getNews(url)
            dic= {
                "id" : hashlib.md5(bytes(url, 'utf-8')).hexdigest(), # Unique ID for each database entry,
                "link": url,
                "content":  x['title']+ x['description'],
                "source": x['source_domain'],
                # "dateTime" : x["date_publish"]
            }
            print(dic["id"])
            res_list.append(dic)
        except:
            pass
    return res_list