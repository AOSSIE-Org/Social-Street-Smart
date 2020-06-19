from todos.news import getNewsDetails
import json
import logging
import os
import time
import uuid
import boto3

dynamodb = boto3.resource('dynamodb')


def create(event, context):
# def create():
    # data = json.loads(event['body'])
    # if 'text' not in data:
    #     logging.error("Validation Failed")
    #     raise Exception("Couldn't create the todo item.")
    
    # timestamp = str(time.time())

    table = dynamodb.Table(os.environ['DYNAMODB_TABLE'])

    print("Scrapping Data...")

    news = getNewsDetails()
    for item in news:

        # write the todo to the database
        table.put_item(Item=item)
        print("Wrote " + item["id"])