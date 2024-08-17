import requests
from bs4 import BeautifulSoup

# Function to scrape URLs from The Hindu
def scrape_theHindu(hindu_url="https://www.thehindu.com/news/international/"):
    print("Scraping The Hindu...")
    response = requests.get(hindu_url)
    print(f"Status Code for The Hindu: {response.status_code}")

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        feed = soup.find_all('div', class_='Other-StoryCard')
        if not feed:
            print("No articles found in The Hindu.")
        else:
            url_list = [x.find("a")["href"] for x in feed]
            return url_list
    else:
        print(f"Failed to scrape The Hindu. Status Code: {response.status_code}")
    
    return []

# Function to scrape URLs from The Wire
def scrape_theWire(wire_url="https://thewire.in/"):
    print("Scraping The Wire...")
    response = requests.get(wire_url)
    print(f"Status Code for The Wire: {response.status_code}")

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        feed = soup.find_all('div', class_='row-element')
        if not feed:
            print("No articles found in The Wire.")
        else:
            url_list = []
            for x in feed:
                if x.find("a") and x.find("a")["href"][0:5] != "https":
                    url_list.append(wire_url[:-1] + x.find("a")["href"])
            return url_list
    else:
        print(f"Failed to scrape The Wire. Status Code: {response.status_code}")
    
    return []

# Main function to scrape and display the URLs
def main():
    print("Starting scraping process...\n")
    
    hindu_urls = scrape_theHindu()
    if hindu_urls:
        print("\nThe Hindu URLs:")
        for url in hindu_urls:
            print(url)
    else:
        print("No URLs found for The Hindu.")

    wire_urls = scrape_theWire()
    if wire_urls:
        print("\nThe Wire URLs:")
        for url in wire_urls:
            print(url)
    else:
        print("No URLs found for The Wire.")

if __name__ == "__main__":
    main()
