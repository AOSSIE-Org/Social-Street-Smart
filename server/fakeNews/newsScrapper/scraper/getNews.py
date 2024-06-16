import json
import os
from scraper.newsWebScrap import getNews as news
from scraper import decimalencoder
import boto3
import base64
# dynamodb = boto3.resource('dynamodb')


def getNews(event, context):

    url = str(event['pathParameters']['url'])
    url = str(base64.b64decode(url))[2:-1]
    scrapedNews = news(url)

    # create a response
    response = {
        "statusCode": 200,
        "body": json.dumps(scrapedNews, cls=decimalencoder.DecimalEncoder)
    }

    return response
