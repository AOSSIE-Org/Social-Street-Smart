from flask import Flask, request,jsonify
import boto3
from boto3.dynamodb.conditions import Key
import urllib.parse , requests
from bs4 import BeautifulSoup

from reportStuff import ReportStuffs

app = Flask(__name__)

# Replace these placeholder values with your actual credentials and region
aws_access_key_id = 'ACCESS KEY'
aws_secret_access_key = 'SECRET KEY'
region_name = 'ap-south-1'  # Mumbai region

# Create a DynamoDB resource instance
db = boto3.resource(
    'dynamodb',
    region_name=region_name,
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key
)

tableFake      = db.Table("Reported-Fake")
tableHate      = db.Table("Reported-Hate")
tableFactCheck = db.Table("Google-FNCheck")

fake_query = ReportStuffs(table_name = tableFake)
hate_query = ReportStuffs(table_name = tableHate)


def createContent(claims):
    output = []
    
    try:
        for claim in claims:
            single_item = {}
            single_item['Content']      = claim['text']
            single_item['claimant']     = claim['claimant']
            single_item['languageCode'] = claim['claimReview'][0]['languageCode']
            single_item['reviewPublisher'] = claim['claimReview'][0]['publisher']['name']
            single_item['reviewPublisherSite'] = claim['claimReview'][0]['publisher']['site']
            single_item['textualRating'] = claim['claimReview'][0]['textualRating']
            single_item['actualFact'] = claim['claimReview'][0]['title']

            output.append(single_item)
    except:
        pass

    return output


def getTextFromLink(url):

    if 'l.facebook.com' in url:
        url = urllib.parse.unquote(url.split("=")[1])
    pageReq = requests.get(url)
    soup = BeautifulSoup(pageReq.content,'lxml')
    title = soup.find("meta", property="og:title")['content']
    if 'reddit.com' in url:
        title = title.split(' - ',1)[-1]
    return title

@app.route("/getText",methods = ['GET','POST'])
def getTexts():
    try:
        if request.method == 'POST':
            reported_link = request.get_json()['link']
            reported_text = getTextFromLink(reported_link)
        if request.method == 'GET':
            reported_text = request.args.get('text')
        return jsonify({ "searchText" : reported_text})

    except AssertionError as error:
            pass

@app.route("/reportfake",methods=['GET','POST'])
def reportfake():
    try:
            if request.method == 'POST':
                reported_link = request.get_json()['link']
                reported_text = getTextFromLink(reported_link)
            if request.method == 'GET':
                reported_text = request.args.get('text')
            return fake_query.updateTable(reported_text)

    except AssertionError as error:
            pass
    
@app.route("/reporthate",methods=['GET','POST'])
def reporthate():
    try:
            if request.method == 'POST':
                reported_link = request.get_json()['link']
                reported_text = getTextFromLink(reported_link)
            if request.method == 'GET':
                reported_text = request.args.get('text')
            return hate_query.updateTable(reported_text)

    except AssertionError as error:
            pass
    

@app.route("/savefc",methods=["POST"])
def storeGFNC():
    if request.method == 'POST':
        claims = request.get_json()["claims"]

        createBatch = createContent(claims)

        with tableFactCheck.batch_writer() as batch:
            for i in range(len(createBatch)):
                batch.put_item(
                    Item = createBatch[i]
                )
        return jsonify({ "statusCode":200 })

@app.route("/")
def home():
    return "Hello World"

if __name__ == "__main__":
    app.run(port=5000, debug=True)