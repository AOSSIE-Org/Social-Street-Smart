import json
import hashlib
import decimal
import requests
from bs4 import BeautifulSoup
import sqlite3
from newsplease import NewsPlease

# Custom Decimal Encoder for JSON
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return int(obj)
        return super(DecimalEncoder, self).default(obj)

# Function to scrape URLs from The Hindu
def scrape_theHindu(hindu_url="https://www.thehindu.com/news/international/"):
    print("Scraping The Hindu...")
    article_urls = []
    news_urls = ['https://www.thehindu.com/']
    for section_url in news_urls:
        section_response = requests.get(section_url)
        section_soup = BeautifulSoup(section_response.text, 'html.parser')
        
        # Adjust this selector based on the structure of the section pages
        article_links = section_soup.select('a[href^="https://www.thehindu.com/news/"]')
        
        for link in article_links:
            article_url = link['href']
            if article_url not in article_urls:
                article_urls.append(article_url)
        
    
    international_response = requests.get('https://www.thehindu.com/news/international/')
    international_soup = BeautifulSoup(international_response.text, 'html.parser')

    # Adjust this selector based on the structure of the page
    more_article_links = international_soup.select('a[href^="https://www.thehindu.com/news/international/"]')

    for link in more_article_links:
        article_url = link['href']
        if article_url not in article_urls:
            article_urls.append(article_url)

    return article_urls

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

# Function to store news articles in SQLite3
def storeNewsInSQLite(news_list, db_connection):
    cursor = db_connection.cursor()
    
    # Create table if not exists
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS NewsTable (
        id TEXT PRIMARY KEY,
        link TEXT,
        content TEXT,
        source TEXT
    )
    ''')
    
    # Insert news articles into the table
    for item in news_list:
        cursor.execute('''
        INSERT OR REPLACE INTO NewsTable (id, link, content, source)
        VALUES (?, ?, ?, ?)
        ''', (item['id'], item['link'], item['content'], item['source']))
        print(f"Wrote {item['id']} to SQLite")
    
    # Commit the changes
    db_connection.commit()

# Main function to orchestrate the scraping and storage process
def main():
    print("Starting news scraping and storage process...")
    
    # Connect to a SQLite database file (this will create the file if it doesn't exist)
    conn = sqlite3.connect('news_articles.db')
    
    news_details = getNewsDetails()
    storeNewsInSQLite(news_details, conn)
    
    # Fetch and display the stored news articles (for verification)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM NewsTable")
    rows = cursor.fetchall()
    for row in rows:
        print(row)
    
    # Close the database connection
    conn.close()
    print("Process completed successfully.")

if __name__ == "__main__":
    main()
