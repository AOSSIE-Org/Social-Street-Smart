from flask import Flask, jsonify, request
import requests
from urllib.parse import urlparse
# from bs4 import BeautifulSoup
import re
from createBloomFilter import load_bloom_filter

app = Flask(__name__)

bloom_filter = load_bloom_filter("./bloomfilter/bloomFilterObj")

@app.route("/")
def home():
    return jsonify({"Title": "AOSSIE's Security Header Checker API for Social Street Smart"})


@app.route("/shc", methods=["POST", "GET"])
def scan_url():
    score = 0
    isValid = "False"

    if request.method == "POST":
        if (request.get_json()):
            url = (request.get_json())["url"]
        else:
            return jsonify({"Error": "No URL Found"})
    else:
        if (request.args.get("url")):
            url = request.args.get("url")
        else:
            return jsonify({"Error": "No URL Found"})
    try:
        url = getLinkFromUrl(url)
        print("\nUrl scheme", urlparse(url),"\n\n")
        if not urlparse(url).scheme:
            url = 'https://' + url
        isValid = "True"
        score = scan_headers(url, score)
    except:
        return jsonify({"Error": "Invalid Url", "url": url})

    return jsonify({"Score": score, "isValid": isValid, "url": url})


def getLinkFromUrl(url):
        
    if 'l.facebook.com' in url:
        # Use regex to find the URL after 'u='
        match = re.search(r'u=(https?://[^\s&]+)', url)
        if match:
            url = match.group(1)
        return url
    if ('twitter.com' in url) or ('t.co/' in url):
        print("twitter url", url, "\n\n")
        try:
            res = requests.get(url, timeout=10, allow_redirects=True)  # Set a timeout of 10 seconds
            res.raise_for_status()  # Raises an HTTPError for bad responses (4xx or 5xx)
            print("Request successful:", res is not None)
            url = res.url
        except requests.exceptions.RequestException as e:
            print("Request failed:", e)
        
    return url

def ScanForMaliciousLink(url):
    return url in bloom_filter

def scan_headers(url, score):
    headers = (requests.get(url)).headers
    print(headers)
    score = scan_xxss(headers, score)
    score = scan_nosniff(headers, score)
    score = scan_xframe(headers, score)
    score = scan_hsts(headers, score)
    score = scan_policy(headers, score)

    return score


def scan_xxss(headers, score):
    # X-XSS-Protection header should be present
    try:
        if "X-XSS-Protection" in headers:
            score = score + 1
    except:
        print(1)
    return score


def scan_nosniff(headers, score):
    # X-Content-Type-Options should be set to 'nosniff'
    try:
        if headers["X-Content-Type-Options"].lower() == "nosniff":
            score = score + 1
    except:
        print(1)

    return score


def scan_xframe(headers, score):
    # X-Frame-Options should be set to DENY or SAMEORIGIN
    try:
        if "deny" in headers["X-Frame-Options"].lower():
            score = score + 1
        elif "sameorigin" in headers["X-Frame-Options"].lower():
            score = score + 1
    except:
        print(1)

    return score


def scan_hsts(headers, score):
    # Strict-Transport-Security header should be present
    try:
        if "Strict-Transport-Security" in headers:
            score = score + 1
    except:
        print(1)

    return score


def scan_policy(headers, score):
    # Security Policy header should be present
    try:
        if "Content-Security-Policy" in headers:
            score = score + 1
    except:
        print(1)

    return score


if __name__ == "__main__":
    app.run(debug=True)
