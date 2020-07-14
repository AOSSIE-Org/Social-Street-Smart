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

@app.route("/")
def hello():
    return "Hello World"

@app.route("/lookup/", methods = ["GET"])
def lookup():

        # Take creds from form data and convert to json 
        # Then set them as an environment variable
        enc_url = request.args.get('link')
        # print(enc_url, file = sys.stderr)

        creds = request.args.get('creds')
        
        # print(creds, file = sys.stderr)
        creds = base64.b64decode(creds)
        # print(creds, file = sys.stderr)
        
        creds = creds.decode("utf-8") 
        
        creds = json.loads(creds)
        with open('/tmp/GoogleAppCreds.json', 'w') as outfile:
            json.dump(creds, outfile)

        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/tmp/GoogleAppCreds.json"

        url = request.args.get('link')
        # url = enc_url
        res = imgL.report(imgL.annotate(str(url)))


        os.remove("/tmp/GoogleAppCreds.json")
        return jsonify(res), 200



if __name__ == '__main__':
    app.run(debug=True)