from flask import Flask, jsonify, request
import requests
import urllib3

app = Flask(__name__)

@app.route("/", methods=["POST", "GET"])
def scan_url():
    score = 0
    isValid = "False"
    
    if request.method == "POST":
        if(request.get_json()):
            url = (request.get_json())["url"]
        else:
            return jsonify({"Title":"AOSSIE's Security Header Checker API for Social Street Smart"})
    else:
        if(request.args.get("url")):
            url = request.args.get("url")
        else:
            return jsonify({"Title":"AOSSIE's Security Header Checker API for Social Street Smart"})
    try:
        if(urllib3.util.parse_url(url).scheme):
            requests.get(url)
        else:
            url = "https://"+url
        isValid = "True"
        score = scan_headers(url, score)
    except:
        return jsonify({"Title":"AOSSIE's Security Header Checker API for Social Street Smart","Error":"Invalid Url"})

    return jsonify({"Title":"AOSSIE's Security Header Checker API for Social Street Smart","Score":score,"isValid": isValid})

def scan_headers(url, score):
    headers = (requests.get(url)).headers
    score = scan_xxss(headers, score)
    score = scan_nosniff(headers, score)
    score = scan_xframe(headers, score)
    score = scan_hsts(headers, score)
    score = scan_policy(headers, score)

    return score

def scan_xxss(headers, score):
    """X-XSS-Protection header should be present"""
    if "X-XSS-Protection" in headers:
        score = score + 1

    return score

def scan_nosniff(headers, score):
    """X-Content-Type-Options should be set to 'nosniff' """
    if headers["X-Content-Type-Options"].lower() == "nosniff":
        score = score + 1

    return score

def scan_xframe(headers, score):
    """X-Frame-Options should be set to DENY or SAMEORIGIN"""
    if "deny" in headers["X-Frame-Options"].lower():
        score = score + 1
    elif "sameorigin" in headers["X-Frame-Options"].lower():
        score = score + 1

    return score

def scan_hsts(headers, score):
    """Strict-Transport-Security header should be present"""
    if "Strict-Transport-Security" in headers:
        score = score + 1

    return score

def scan_policy(headers, score):
    """Security Policy header should be present"""
    if "Content-Security-Policy" in headers:
            score = score + 1

    return score


if __name__ == "__main__":
    app.run( port = 5000 ,debug = True )