# app.py
from flask import Flask, request, jsonify
import requests
import os
import re
import sqlite3
import logging
import numpy as np
from bs4 import BeautifulSoup
from groq import Groq
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse
from dotenv import load_dotenv
from ML.helperML import get_features, get_classes, loadLite

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Initialize Groq client
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"  # Using LLaMA 3 70B model

# Search engines API endpoints
GOOGLE_SEARCH_API = "https://www.googleapis.com/customsearch/v1"
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
GOOGLE_CX = os.environ.get("GOOGLE_CX")  # Custom Search Engine ID

# Database path
DB_PATH = "../newsScrapper/news_articles.db"

# Import ML functions if they exist in the same directory
try:
    from ML.helperML import get_features, get_classes, loadLite
    # Load the TFLite model interpreter
    interpreter = loadLite()
    ML_ENABLED = True
    logger.info("ML model loaded successfully")
except ImportError:
    logger.warning("ML model could not be loaded. Running without ML classification.")
    ML_ENABLED = False
    interpreter = None

# Function to get prediction using ML model
def get_prediction(h, b):
    global interpreter
    if interpreter is None:
        logger.error("Error in loading trained model")
        return "unknown"
    
    try:
        feat = get_features(h, b)
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        input_data = np.array(feat, dtype=np.float32)
        interpreter.set_tensor(input_details[0]['index'], input_data)
        
        interpreter.invoke()

        output_data = interpreter.get_tensor(output_details[0]['index'])
        class_ = get_classes(output_data)

        return class_
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        return "unknown"

# Function to search the web via Google Custom Search
def google_search(query, num_results=5):
    try:
        params = {
            'key': GOOGLE_API_KEY,
            'cx': GOOGLE_CX,
            'q': query,
            'num': num_results
        }
        response = requests.get(GOOGLE_SEARCH_API, params=params)
        data = response.json()
        
        if 'items' not in data:
            logger.warning(f"No search results found for query: {query}")
            return []
            
        results = []
        for item in data['items']:
            results.append({
                'title': item.get('title', ''),
                'link': item.get('link', ''),
                'snippet': item.get('snippet', '')
            })
        return results
    except Exception as e:
        logger.error(f"Error in Google search: {str(e)}")
        return []

# Function to fetch content from a URL
def fetch_url_content(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Check if the content is HTML
        if 'text/html' in response.headers.get('Content-Type', ''):
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.extract()
                
            # Get text content
            text = soup.get_text()
            
            # Clean up text (remove excess whitespace, etc.)
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = '\n'.join(chunk for chunk in chunks if chunk)
            
            # Truncate if too long
            return text[:5000]
        else:
            logger.warning(f"URL {url} returned non-HTML content")
            return ""
    except Exception as e:
        logger.error(f"Error fetching URL {url}: {str(e)}")
        return ""

# Parallel fetch content from multiple URLs
def fetch_multiple_contents(urls):
    valid_urls = []
    for url in urls:
        parsed = urlparse(url)
        if parsed.scheme and parsed.netloc:
            valid_urls.append(url)
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(fetch_url_content, valid_urls))
    
    return dict(zip(valid_urls, results))

def analyze_claim_with_groq(claim, sources_data):
    # Construct prompt with claim and source data
    sources_text = "\n\n".join([
        f"SOURCE {i+1}: {url}\n{content[:1000]}..." if len(content) > 1000 else f"SOURCE {i+1}: {url}\n{content}"
        for i, (url, content) in enumerate(sources_data.items()) if content.strip()
    ])
    
    prompt = f"""
    CLAIM TO FACT CHECK: "{claim}"
    
    SOURCES:
    {sources_text}
    
    TASK:
    1. Analyze the provided claim against the given sources.
    2. Determine if the claim is "true" or "false" based on the information.
    3. Provide your reasoning and cite specific evidence from the sources.
    4. Return your verdict as either "TRUE" or "FALSE" at the beginning of your response.
    
    YOUR ANALYSIS:
    """
    
    try:
        response = groq_client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You are an objective fact-checker. Evaluate claims against evidence and provide a clear verdict of TRUE or FALSE. Be balanced and thorough in your analysis."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=1000
        )
        
        analysis = response.choices[0].message.content
        
        # Extract verdict
        verdict_match = re.search(r"(TRUE|FALSE)", analysis, re.IGNORECASE)
        verdict = verdict_match.group(0).upper() if verdict_match else None
        
        # Convert to boolean representation
        if verdict:
            verdict_bool = "true" if verdict.upper() == "TRUE" else "false"
        else:
            verdict_bool = None
            
        # Remove the verdict from the beginning for cleaner output
        reasoning = re.sub(r"^(TRUE|FALSE)(\s*:)?", "", analysis, flags=re.IGNORECASE).strip()
        
        return {
            "verdict": verdict_bool,
            "reasoning": reasoning
        }
    except Exception as e:
        logger.error(f"Error in Groq analysis: {str(e)}")
        return {
            "verdict": None,
            "reasoning": f"An error occurred during analysis: {str(e)}"
        }

# New function to get comprehensive data from DB
def get_comprehensive_db_data(claim):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Try to find exact claim match first
        cursor.execute("SELECT source_url, content FROM NewsTable WHERE claim = ? OR content LIKE ?", 
                       (claim, f"%{claim}%"))
        rows = cursor.fetchall()
        
        sources_data = {}
        for row in rows:
            source_url, content = row
            sources_data[source_url] = content
        
        # Also check for related web sources we've stored before
        cursor.execute("SELECT source_url, content FROM WebSourcesTable WHERE related_claim LIKE ?", 
                       (f"%{claim}%",))
        web_rows = cursor.fetchall()
        for row in web_rows:
            source_url, content = row
            sources_data[source_url] = content
            
        conn.close()
        return sources_data
    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        return {}

# Function to store web sources in DB
def store_web_sources_in_db(claim, sources_data):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Create table if not exists
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS WebSourcesTable (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            related_claim TEXT,
            source_url TEXT,
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Store each source
        for url, content in sources_data.items():
            if url and content and len(content) > 10:
                # Check if this URL already exists for this claim
                cursor.execute(
                    "SELECT id FROM WebSourcesTable WHERE related_claim = ? AND source_url = ?",
                    (claim, url)
                )
                if not cursor.fetchone():  # Only insert if it doesn't exist
                    cursor.execute(
                        "INSERT INTO WebSourcesTable (related_claim, source_url, content) VALUES (?, ?, ?)",
                        (claim, url, content)
                    )
        
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"Error storing web sources: {str(e)}")

# Direct ML prediction for fallback
def direct_ml_prediction(claim):
    if not ML_ENABLED or interpreter is None:
        return "unknown"
    
    try:
        # Use ML model with just the claim text as both inputs
        # This is a simplified approach when we don't have matching content
        feat = get_features(claim, claim)
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        input_data = np.array(feat, dtype=np.float32)
        interpreter.set_tensor(input_details[0]['index'], input_data)
        
        interpreter.invoke()

        output_data = interpreter.get_tensor(output_details[0]['index'])
        class_ = get_classes(output_data)

        return class_
    except Exception as e:
        logger.error(f"Error in direct ML prediction: {str(e)}")
        return "unknown"

# Compare claim with news article using ML model
def compare_with_news_content(claim, content):
    if not ML_ENABLED:
        return "unknown"
    
    try:
        pred = get_prediction(claim, content)
        return pred
    except Exception as e:
        logger.error(f"Error in news comparison: {str(e)}")
        return "unknown"

@app.route('/predict', methods=['POST','GET'])
def predict():
    data = request.json
    
    # Check for source-specific processing
    if 'source' in data and data['source'] == 'newsWeb':
        # Handle old API format
        if 'body' in data and 'description' in data['body']:
            claim = data['body']['description']
        else:
            return jsonify({"error": "Invalid request format"}), 400
    elif 'claim' in data:
        # Handle new API format
        claim = data['claim']
    else:
        return jsonify({"error": "No claim provided"}), 400
    
    logger.info(f"Received claim to check: {claim}")
    
    # # Step 1: Check if we can make a direct ML prediction on the claim if we have stored news
    # try:
    #     conn = sqlite3.connect(DB_PATH)
    #     cursor = conn.cursor()
        
    #     # Get a few news articles to compare with the claim
    #     cursor.execute("SELECT content FROM NewsTable LIMIT 10")
    #     news_rows = cursor.fetchall()
    #     conn.close()
        
    #     for row in news_rows:
    #         news_content = row[0]
    #         if ML_ENABLED:
    #             pred = compare_with_news_content(claim, news_content)
    #             if pred == "disagree":
    #                 logger.info("ML model determined claim is likely false based on stored news")
    #                 return jsonify({'prediction': "Fake"})
    #             elif pred == "agree":
    #                 logger.info("ML model determined claim is likely true based on stored news")
    #                 return jsonify({'prediction': "Genuine"})
            
    # except Exception as e:
    #     logger.error(f"Error checking news content with ML: {str(e)}")
    
    # Step 2: Get comprehensive data from database
    db_data = get_comprehensive_db_data(claim)
    
    # Step 3: If we have sufficient data from DB, analyze with LLM
    if db_data and len(db_data) >= 2:  # At least 2 sources for better analysis
        logger.info(f"Analyzing claim using {len(db_data)} sources from database")
        db_analysis = analyze_claim_with_groq(claim, db_data)
        
        if db_analysis["verdict"] == "true":
            logger.info("LLM analysis of DB sources determined claim is TRUE")
            return jsonify({'prediction': "Genuine"})
        elif db_analysis["verdict"] == "false":
            logger.info("LLM analysis of DB sources determined claim is FALSE")
            return jsonify({'prediction': "Fake"})
    
    # Step 4: Get web search results
    search_query = f"fact check {claim}"
    search_results = google_search(search_query)
    
    # Step 5: Fetch content from URLs if search results exist
    web_sources = {}
    if search_results:
        logger.info(f"Found {len(search_results)} search results for claim")
        urls = [result['link'] for result in search_results]
        web_sources = fetch_multiple_contents(urls)
        
        # Filter out empty content
        web_sources = {url: content for url, content in web_sources.items() if content.strip()}
        
        # Store web sources in database for future use
        if web_sources:
            store_web_sources_in_db(claim, web_sources)
    
    # Step 6: Combine all available data for analysis
    all_sources = {}
    if db_data:
        all_sources.update(db_data)
    if web_sources:
        all_sources.update(web_sources)
    
    # Step 7: Analyze using LLM if we have combined sources
    if all_sources:
        logger.info(f"Analyzing claim using {len(all_sources)} combined sources")
        analysis_result = analyze_claim_with_groq(claim, all_sources)
        
        if analysis_result["verdict"] == "true":
            logger.info("LLM analysis of all sources determined claim is TRUE")
            return jsonify({'prediction': "Genuine"})
        elif analysis_result["verdict"] == "false":
            logger.info("LLM analysis of all sources determined claim is FALSE")
            return jsonify({'prediction': "Fake"})
    
    
    # If we still have no definitive result
    logger.info("Could not determine veracity of claim")
    return jsonify({'prediction': "Unknown"})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/', methods=['GET'])
def index():
    return "AOSSIE's Fake News API for Social Street Smart"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5008)
