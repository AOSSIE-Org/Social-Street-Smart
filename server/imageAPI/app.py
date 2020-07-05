from flask import Flask, request, jsonify, json
# from web_detect import report, annotate
import argparse
import io
from google.cloud import vision
from google.cloud.vision import types
import web_detect
import base64
import sys
import os
app = Flask(__name__)
app.debug=True

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
        res = report(annotate(str(url)[2:-1]))
        # res = "test"
        print(res, file=sys.stderr)

        os.remove("/tmp/GoogleAppCreds.json")
        return jsonify(res), 200



if __name__ == '__main__':
    app.run(debug=True)



def annotate(path):
    """Returns web annotations given the path to an image."""
    client = vision.ImageAnnotatorClient()

    if path.startswith('http') or path.startswith('gs:'):
        image = types.Image()
        image.source.image_uri = path

    else:
        with io.open(path, 'rb') as image_file:
            content = image_file.read()

        image = types.Image(content=content)

    web_detection = client.web_detection(image=image).web_detection

    return web_detection


def report(annotations):
    """Prints detected features in the provided web annotations."""
    urls = []
    for page in annotations.pages_with_matching_images:
        urls.append({"url" : page.url})
    
    return urls
    # if annotations.pages_with_matching_images:
    #     print('\n{} Pages with matching images retrieved'.format(
    #         len(annotations.pages_with_matching_images)))

    #     for page in annotations.pages_with_matching_images:
    #         print('Url   : {}'.format(page.url))

    # if annotations.full_matching_images:
    #     print('\n{} Full Matches found: '.format(
    #           len(annotations.full_matching_images)))

    #     for image in annotations.full_matching_images:
    #         print('Url  : {}'.format(image.url))

    # if annotations.partial_matching_images:
    #     print('\n{} Partial Matches found: '.format(
    #           len(annotations.partial_matching_images)))

    #     for image in annotations.partial_matching_images:
    #         print('Url  : {}'.format(image.url))

    # if annotations.web_entities:
    #     print('\n{} Web entities found: '.format(
    #           len(annotations.web_entities)))

    #     for entity in annotations.web_entities:
    #         print('Score      : {}'.format(entity.score))
    #         print('Description: {}'.format(entity.description))
