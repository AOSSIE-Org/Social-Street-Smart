import json
import os
import hashlib
import decimal
import requests
from bs4 import BeautifulSoup
import boto3
from newsplease import NewsPlease

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')

# Custom Decimal Encoder for JSON
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return int(obj)
        return super(DecimalEncoder, self).default(obj)

# Function to scrape URLs from The Hindu
def scrape_theHindu(hindu_url="https://www.thehindu.com/news/international/"):
    print("Scraping The Hindu...")
    news = requests.get(hindu_url)
    url_list = []
    
    if news.status_code == 200:
        soup = BeautifulSoup(news.text, 'html.parser')
        feed = soup.find_all('div', class_='Other-StoryCard')
        for x in feed:
            url_list.append(x.find("a")["href"])
    
    return url_list

# Function to scrape URLs from The Wire
def scrape_theWire(wire_url="https://thewire.in/"):
    print("Scraping The Wire...")
    news = requests.get(wire_url)
    url_list = []
    
    if news.status_code == 200:
        soup = BeautifulSoup(news.text, 'html.parser')
        feed = soup.find_all('div', class_='card__title')
        for x in feed:
            if x.find("a")["href"][0:5] != "https":  # to avoid navigation to other pages
                url_list.append(wire_url[:-1] + x.find("a")["href"])
    
    return url_list

# Function to scrape and process news articles from URLs
def getNewsDetails():
    news_url_list = scrape_theHindu() + scrape_theWire()
    result_list = []
    
    for url in news_url_list:
        try:
            news_data = getNews(url)
            item = {
                "id": hashlib.md5(bytes(url, 'utf-8')).hexdigest(),  # Unique ID for each database entry
                "link": url,
                "content": news_data['title'] + news_data['description'],
                "source": news_data['source_domain'],
            }
            print(f"Processed {item['id']}")
            result_list.append(item)
        except Exception as e:
            print(f"Error processing URL {url}: {e}")
    
    return result_list

# Function to fetch news details using NewsPlease
def getNews(url):
    article = NewsPlease.from_url(url)
    news = {
        "authors": article.authors or "",
        "description": article.description or "",
        "language": article.language or "",
        "source_domain": article.source_domain or "",
        "text": article.text or "",
        "title": article.title or "",
        "url": article.url or ""
    }
    return news

# Function to store news articles in DynamoDB
def storeNewsInDynamoDB(news_list):
    table = dynamodb.Table('NewsTable')
    
    for item in news_list:
        table.put_item(Item=item)
        print(f"Wrote {item['id']} to DynamoDB")

# Main function to orchestrate the scraping and storage process
def main():
    print("Starting news scraping and storage process...")
    news_details = getNewsDetails()
    storeNewsInDynamoDB(news_details)
    print("Process completed successfully.")

if __name__ == "__main__":
    main()
