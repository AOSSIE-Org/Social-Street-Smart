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
        creds = request.form.get('creds')
        creds = json.loads(creds)
        with open('/tmp/GoogleAppCreds.json', 'w') as outfile:
            json.dump(creds, outfile)

        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/tmp/GoogleAppCreds.json"

        enc_url = request.args.get('link')
        url = base64.b64decode(enc_url)
        res = imgL.report(imgL.annotate(str(url)[2:-1]))
        # print(res, file=sys.stderr)
        # try:
        for iURL in res:
            try:
                r = requests.get(iURL['url'], headers=headers)
                html = bs4.BeautifulSoup(r.text, features="html.parser")
                title = html.title.text
                print(title, file = sys.stderr)
            except: 
                print("ERROR RETREIVING TITLE: " + iURL['url'])
        os.remove("/tmp/GoogleAppCreds.json")
        return jsonify(res), 200



if __name__ == '__main__':
    app.run(debug=True)



# def annotate(path):
#     """Returns web annotations given the path to an image."""
#     client = vision.ImageAnnotatorClient()

#     if path.startswith('http') or path.startswith('gs:'):
#         image = types.Image()
#         image.source.image_uri = path

#     else:
#         with io.open(path, 'rb') as image_file:
#             content = image_file.read()

#         image = types.Image(content=content)

#     web_detection = client.web_detection(image=image).web_detection

#     return web_detection


# def report(annotations):
#     """Prints detected features in the provided web annotations."""
#     urls = []
#     for page in annotations.pages_with_matching_images:
#         urls.append({"url" : page.url})
    
#     return urls