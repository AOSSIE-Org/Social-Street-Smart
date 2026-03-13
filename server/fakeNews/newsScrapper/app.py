import json
import hashlib
import decimal
import requests
from bs4 import BeautifulSoup
import sqlite3
from goose3 import Goose

# Custom Decimal Encoder for JSON (Not strictly needed with Goose3, but good practice)
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
        try:
            section_response = requests.get(section_url)
            section_response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
            section_soup = BeautifulSoup(section_response.text, 'html.parser')

            # Adjust this selector based on the structure of the section pages
            article_links = section_soup.select('a[href^="https://www.thehindu.com/news/"]')

            for link in article_links:
                article_url = link['href']
                if article_url not in article_urls:
                    article_urls.append(article_url)
        except requests.exceptions.RequestException as e:
            print(f"Error scraping The Hindu section {section_url}: {e}")


    try:
        international_response = requests.get('https://www.thehindu.com/news/international/')
        international_response.raise_for_status()
        international_soup = BeautifulSoup(international_response.text, 'html.parser')

        # Adjust this selector based on the structure of the page
        more_article_links = international_soup.select('a[href^="https://www.thehindu.com/news/international/"]')

        for link in more_article_links:
            article_url = link['href']
            if article_url not in article_urls:
                article_urls.append(article_url)
    except requests.exceptions.RequestException as e:
        print(f"Error scraping The Hindu international section: {e}")

    return article_urls

# Function to scrape URLs from The Wire
def scrape_theWire(wire_url="https://thewire.in/"):
    print("Scraping The Wire...")
    url_list = []
    try:
        news = requests.get(wire_url)
        news.raise_for_status()
        soup = BeautifulSoup(news.text, 'html.parser')
        feed = soup.find_all('div', class_='card__title')
        for x in feed:
            href = x.find("a")["href"]
            if href[0:5] != "https":  # to avoid navigation to other pages
                url_list.append(wire_url[:-1] + href)
    except requests.exceptions.RequestException as e:
        print(f"Error scraping The Wire: {e}")
    return url_list

# Function to scrape and process news articles from URLs
def getNewsDetails():
    news_url_list = scrape_theHindu() + scrape_theWire()
    result_list = []

    for url in news_url_list:
        try:
            news_data = getNews(url)
            if news_data:  # Check if news_data is not None (due to errors in getNews)
                item = {
                    "id": hashlib.md5(bytes(url, 'utf-8')).hexdigest(),  # Unique ID
                    "link": url,
                    "content": news_data['title'] + " " + news_data['description'], # Space between title and desc
                    "source": news_data['source_domain'],
                }
                print(f"Processed {item['id']}")
                result_list.append(item)
        except Exception as e:
            print(f"Error processing URL {url} in getNewsDetails: {e}")  # More specific error

    return result_list

# Function to fetch news details using Goose3
def getNews(url):
    g = Goose()
    try:
        article = g.extract(url=url)
        news = {
            "authors": article.authors,
            "description": article.meta_description,
            "language": article.meta_lang,
            "source_domain": article.domain,  # Goose3 uses 'domain'
            "text": article.cleaned_text,
            "title": article.title,
            "url": article.final_url if article.final_url else url, # Fallback to original URL
        }
        return news
    except Exception as e:
        print(f"Error extracting with Goose3 for URL {url}: {e}")
        return None  # Return None on error, so we can skip this article

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
        if item is not None: # Ensure item is valid
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