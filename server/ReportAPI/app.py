#!/usr/bin/env python3
"""
Social Media Content Reporting API

This Flask application provides an API for reporting and managing potentially problematic
content from social media platforms. It enables users to report fake news and hate speech,
extract text from URLs, and interact with AWS DynamoDB to store and retrieve reports.

The API connects to three DynamoDB tables:
- Reported-Fake: Stores reports of fake news content
- Reported-Hate: Stores reports of hate speech content
- Google-FNCheck: Stores fact-checking information from Google's Fact Check API

Dependencies:
    - Flask
    - boto3 (AWS SDK)
    - requests
    - BeautifulSoup
    - dotenv
    - ReportStuff (custom module for report handling)
"""

from flask import Flask, request, jsonify
import boto3
from boto3.dynamodb.conditions import Key
import urllib.parse, requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os
from reportStuff import ReportStuffs

# Load environment variables from .env file
load_dotenv()
app = Flask(__name__)

# AWS DynamoDB configuration
aws_access_key_id = os.getenv("AWS_ACCESS_KEY_DYNAMODB_REPORT_API")
aws_secret_access_key = os.getenv('AWS_SCRETE_KEY_DYNAMODB_REPORT_API')
region_name = os.getenv('AWS_REGION_DYNAMODB_REPORT_API')  # Mumbai region

# Create a DynamoDB resource instance
db = boto3.resource(
    'dynamodb',
    region_name=region_name,
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key
)

# Initialize DynamoDB tables
tableFake = db.Table("Reported-Fake")
tableHate = db.Table("Reported-Hate")
tableFactCheck = db.Table("Google-FNCheck")

# Initialize report handlers
fake_query = ReportStuffs(table_name=tableFake)
hate_query = ReportStuffs(table_name=tableHate)


def createContent(claims):
    """
    Process claims data from Google Fact Check API into a standardized format.
    
    Args:
        claims (list): List of claim objects from Google Fact Check API
        
    Returns:
        list: Processed claim objects with standardized structure
    """
    output = []
    
    try:
        for claim in claims:
            single_item = {}
            single_item['Content'] = claim['text']
            single_item['claimant'] = claim['claimant']
            single_item['languageCode'] = claim['claimReview'][0]['languageCode']
            single_item['reviewPublisher'] = claim['claimReview'][0]['publisher']['name']
            single_item['reviewPublisherSite'] = claim['claimReview'][0]['publisher']['site']
            single_item['textualRating'] = claim['claimReview'][0]['textualRating']
            single_item['actualFact'] = claim['claimReview'][0]['title']

            output.append(single_item)
    except Exception:
        # Silently handle any exceptions during processing
        pass

    return output


def getTextFromLink(url):
    """
    Extract the title or main content text from a provided URL.
    Handles special cases for Facebook and Reddit links.
    
    Args:
        url (str): URL to extract text from
        
    Returns:
        str: Extracted title or main content text
    """
    # Handle Facebook redirect links
    if 'l.facebook.com' in url:
        url = urllib.parse.unquote(url.split("=")[1])
    
    # Fetch page content
    pageReq = requests.get(url)
    soup = BeautifulSoup(pageReq.content, 'lxml')
    title = soup.find("meta", property="og:title")['content']
    
    # Special handling for Reddit content
    if 'reddit.com' in url:
        title = title.split(' - ', 1)[-1]
    
    return title


@app.route("/getText", methods=['GET', 'POST'])
def getTexts():
    """
    Endpoint to extract text content from a URL or directly from a text parameter.
    
    Methods:
        POST: Extract text from a URL provided in the JSON body
        GET: Return the text provided in the query parameter
        
    Returns:
        JSON: Contains the extracted or provided text
    """
    try:
        if request.method == 'POST':
            reported_link = request.get_json()['link']
            reported_text = getTextFromLink(reported_link)
        if request.method == 'GET':
            reported_text = request.args.get('text')
        return jsonify({"searchText": reported_text})

    except AssertionError as error:
        pass


@app.route("/reportfake", methods=['GET', 'POST'])
def reportfake():
    """
    Endpoint to report fake news content.
    
    Methods:
        POST: Report fake news from a URL or direct text input
        GET: Report fake news from text provided in query parameter
        
    Returns:
        JSON: Response from ReportStuffs.updateTable()
    """
    try:
        if request.method == 'POST':
            data = request.get_json()
            if 'link' in data:
                reported_link = data['link']
                reported_text = getTextFromLink(reported_link)
            elif 'text' in data:
                reported_text = data['text']
            else:
                return "No link or text provided", 400
            
            # Ensure reported_text is a string before encoding
            reported_text = urllib.parse.quote(str(reported_text), safe='')
        elif request.method == 'GET':
            reported_text = request.args.get('text')
            if reported_text is None:
                return "Text parameter is required", 400
            
            # Ensure reported_text is a string before encoding
            reported_text = urllib.parse.quote(str(reported_text), safe='')
        
        return fake_query.updateTable(reported_text)

    except AssertionError as error:
        return str(error), 400


@app.route("/reporthate", methods=['GET', 'POST'])
def reporthate():
    """
    Endpoint to report hate speech content.
    
    Methods:
        POST: Report hate speech from a URL or direct text input
        GET: Report hate speech from text provided in query parameter
        
    Returns:
        JSON: Response from ReportStuffs.updateTable()
    """
    try:
        if request.method == 'POST':
            data = request.get_json()
            if 'link' in data:
                reported_link = data['link']
                reported_text = getTextFromLink(reported_link)
            elif 'text' in data:
                reported_text = data['text']
            else:
                return "No link or text provided", 400
            
            # Ensure reported_text is a string before encoding
            reported_text = urllib.parse.quote(str(reported_text), safe='')
        elif request.method == 'GET':
            reported_text = request.args.get('text')
            if reported_text is None:
                return "Text parameter is required", 400
            
            # Ensure reported_text is a string before encoding
            reported_text = urllib.parse.quote(str(reported_text), safe='')
        
        return hate_query.updateTable(reported_text)

    except AssertionError as error:
        return str(error), 400


@app.route("/savefc", methods=["POST"])
def storeGFNC():
    """
    Endpoint to store Google Fact Check API claims in DynamoDB.
    
    Methods:
        POST: Store claims data provided in the request body
        
    Returns:
        JSON: Status code indicating success
    """
    if request.method == 'POST':
        claims = request.get_json()["claims"]

        # Process claims into standardized format
        createBatch = createContent(claims)

        # Use batch writer to efficiently write multiple items to DynamoDB
        with tableFactCheck.batch_writer() as batch:
            for i in range(len(createBatch)):
                batch.put_item(
                    Item=createBatch[i]
                )
        return jsonify({"statusCode": 200})


@app.route("/")
def home():
    """
    Root endpoint that returns a simple greeting.
    
    Returns:
        str: "Hello World" greeting
    """
    return "Hello World"


if __name__ == "__main__":
    app.run(port=5000, debug=True)
