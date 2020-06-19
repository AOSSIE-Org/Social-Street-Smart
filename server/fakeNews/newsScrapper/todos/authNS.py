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
    hindu_page_source= d2.page_source
    hsoup = BeautifulSoup(hindu_page_source, 'lxml')
    hfeeds= hsoup.find_all('div', class_= 'Other-StoryCard')
    h_url_li= []
    for x in hfeeds:
        h_url_li.append(x.find("a")["href"])
    return h_url_li

def scrap_wire(wire_url= "https://thewire.in/"):
    print("schduled scraping from the wire")
    driver = webdriver.Chrome("/usr/lib/chromium-browser/chromedriver", chrome_options=options)
    wire_url= "https://thewire.in/"
    driver.get(wire_url)
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, 'lxml')
    feeds= soup.find_all('div',class_='card__title')
    url_list= []
    for x in feeds:
        if x.find("a")["href"][0:5]!="https" : # to avoid navigation to other page
            url_list.append(wire_url[:-1]+ x.find("a")["href"])
    return url_list

def authNewsScraper():
    news_url_li= scrap_Thindu()+ scrap_wire()
    res_list= []
    for url in news_url_li:
        print(url)
        x= getNews(url)
        # time.sleep(1)
        dic= {
            "link": url,
            "content":  x['title']+ x['description'],
            "source": x['source_domain'],
            "dateTime" : x["date_publish"]
        }
        # print(dic)
        res_list.append(dic)
    # print(res_list[0], len(res_list))
    return res_list

if __name__ == "__main__":
    authNewsScraper()    


