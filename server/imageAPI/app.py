from flask import Flask, request, jsonify, json
# from web_detect import report, annotate

import argparse
import io
from google.cloud import vision
from google.cloud.vision import types
# import web_detect
import imageLookup as imgL
import base64
import sys
import os
import bs4
import requests

app = Flask(__name__)
app.debug=True

headers = {'user-agent':'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Mobile Safari/537.36'}

# Live Endpoint https://j9sgfnzwo8.execute-api.us-east-1.amazonaws.com/dev/

@app.route("/")
def hello():
    return "Hello World"

@app.route("/lookup/", methods = ["GET"])
def lookup():
        # Take creds from form data and convert to json 
        # Then set them as an environment variable
        enc_url = request.args.get('link')
        creds = request.args.get('creds')
        creds = base64.b64decode(creds)
        creds = creds.decode("utf-8") 
        # print(len(creds), file = sys.stderr)
        if (creds == "undefined"):
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./GoogleAppCreds.json"
        else:
            creds = json.loads(creds)
            with open('/tmp/GoogleAppCreds.json', 'w') as outfile:
                json.dump(creds, outfile)
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/tmp/GoogleAppCreds.json"

        url = request.args.get('link')
        res = imgL.report(imgL.annotate(str(url)))
        print("Result", file = sys.stderr)
        print(jsonify(res), file = sys.stderr)
        os.remove("/tmp/GoogleAppCreds.json")
        return jsonify(res), 200

if __name__ == '__main__':
    app.run(debug=True)