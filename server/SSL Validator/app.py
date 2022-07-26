from OpenSSL import SSL
from cryptography import x509
import idna
from datetime import datetime
from socket import socket
from flask import Flask, jsonify, request
from urllib.parse import urlparse


app = Flask(__name__)

@app.route("/", methods=["POST", "GET"])
def check_url():
    isSafe = "False"
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
        hostname = get_hostname(url)
        if(hostname):
            isValid, isSafe = check_safety(hostname, isSafe, isValid)
    except:
        return jsonify({"Title":"AOSSIE's SSl Checker API for Social Street Smart","Error":"Invalid Url"})

    return jsonify(
        {"isSafe":isSafe,
        "isValid": isValid})

def get_hostname(url):
    if not urlparse(url).scheme:
        url = 'https://' + url
    hostname = urlparse(url).netloc

    return (hostname)


def check_safety(hostname, isValid , isSafe):
    try:
        hostname_idna = idna.encode(hostname)
    except:
        isValid = "False"
        isSafe = "False"
        
        return (isValid, isSafe)
    sock = socket()
    try:
        sock.connect((hostname, 443))
    except:
        isValid = "False"
        isSafe = "False"

        return (isValid, isSafe)
    peername = sock.getpeername()
    ctx = SSL.Context(SSL.SSLv23_METHOD) # most compatible
    ctx.check_hostname = False
    ctx.verify_mode = SSL.VERIFY_NONE
    sock_ssl = SSL.Connection(ctx, sock)
    sock_ssl.set_connect_state()
    sock_ssl.set_tlsext_host_name(hostname_idna)
    sock_ssl.do_handshake()
    cert = sock_ssl.get_peer_certificate()
    crypto_cert = cert.to_cryptography()
    sock_ssl.close()
    sock.close()
    not_before = crypto_cert.not_valid_before
    not_after = crypto_cert.not_valid_after

    if((datetime.now() < not_after and (not_after - not_before).days > 30)):
        isValid = "True"
        isSafe = "True"
    else:
        isValid = "True"
        isSafe = "False"

    return (isValid, isSafe)

    

if __name__ == "__main__":
    app.run( debug = True )

