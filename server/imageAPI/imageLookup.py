import argparse
import io

from google.cloud import vision
from google.cloud.vision import types

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