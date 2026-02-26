from flask import Flask, request, jsonify
import os
from supabase import create_client, Client
import urllib.parse, requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)

# Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


# Create a Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class ReportStuffs:
    def __init__(self, table_name):
        self.table_name = table_name

    def query_avail(self, text):
        response = supabase.table(self.table_name).select("*").eq("content", text).execute()
        return len(response.data) > 0

    def save_query(self, text):
        response = supabase.table(self.table_name).insert({"content": text, "report_count": 1}).execute()
        return response.status_code

    def update_count(self, text):
        response = supabase.rpc("increment_report_count", {"content_param": text}).execute()
        return response.status_code

    def update_table(self, text):
        if self.query_avail(text):
            response = self.update_count(text)
        else:
            response = self.save_query(text)
        return jsonify({"statusCode": response, "text": text})

# Tables
fake_query = ReportStuffs("reported_fake")
hate_query = ReportStuffs("reported_hate")

def get_text_from_link(url):
    if 'l.facebook.com' in url:
        url = urllib.parse.unquote(url.split("=")[1])
    page_req = requests.get(url)
    soup = BeautifulSoup(page_req.content, 'lxml')
    title = soup.find("meta", property="og:title")['content']
    if 'reddit.com' in url:
        title = title.split(' - ', 1)[-1]
    return title

@app.route("/getText", methods=['GET', 'POST'])
def get_texts():
    try:
        if request.method == 'POST':
            reported_link = request.get_json()['link']
            reported_text = get_text_from_link(reported_link)
        else:
            reported_text = request.args.get('text')
        return jsonify({"searchText": reported_text})
    except Exception as e:
        return str(e), 400

@app.route("/reportfake", methods=['GET', 'POST'])
def report_fake():
    try:
        if request.method == 'POST':
            data = request.get_json()
            reported_text = get_text_from_link(data['link']) if 'link' in data else data.get('text')
        else:
            reported_text = request.args.get('text')
        if not reported_text:
            return "Text parameter is required", 400
        return fake_query.update_table(urllib.parse.quote(str(reported_text), safe=''))
    except Exception as e:
        return str(e), 400

@app.route("/reporthate", methods=['GET', 'POST'])
def report_hate():
    try:
        if request.method == 'POST':
            data = request.get_json()
            reported_text = get_text_from_link(data['link']) if 'link' in data else data.get('text')
        else:
            reported_text = request.args.get('text')
        if not reported_text:
            return "Text parameter is required", 400
        return hate_query.update_table(urllib.parse.quote(str(reported_text), safe=''))
    except Exception as e:
        return str(e), 400

@app.route("/savefc", methods=["POST"])
def store_gfnc():
    try:
        claims = request.get_json()["claims"]
        formatted_claims = [{
            "content": claim['text'],
            "claimant": claim.get('claimant', ''),
            "languageCode": claim['claimReview'][0].get('languageCode', ''),
            "reviewPublisher": claim['claimReview'][0]['publisher'].get('name', ''),
            "reviewPublisherSite": claim['claimReview'][0]['publisher'].get('site', ''),
            "textualRating": claim['claimReview'][0].get('textualRating', ''),
            "actualFact": claim['claimReview'][0].get('title', '')
        } for claim in claims]
        supabase.table("google_fncheck").insert(formatted_claims).execute()
        return jsonify({"statusCode": 200})
    except Exception as e:
        return str(e), 400

@app.route("/")
def home():
    return "Hello World"

if __name__ == "__main__":
    app.run(port=5000, debug=True)