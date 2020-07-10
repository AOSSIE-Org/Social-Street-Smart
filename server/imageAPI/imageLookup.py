import argparse
import io
import bs4
import requests
from google.cloud import vision
from google.cloud.vision import types

headers = {'user-agent':'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Mobile Safari/537.36'}


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
        # urls.append({"title" : " "})
        try:
            r = requests.get(page.url, headers=headers)
            html = bs4.BeautifulSoup(r.text, features="html.parser")
            title = html.title.text
            # iURL['title'] = title;
            urls.append({"title" : title})
            # print(title, file = sys.stderr)
        except: 
            # print("ERROR RETREIVING TITLE: " + iURL['url'])
            # iURL['title'] = "Err.";
            urls.append({"title" : " "})
    
    return urls