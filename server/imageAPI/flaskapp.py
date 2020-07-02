from flask import Flask
from web_detect import report, annotate
import base64
app = Flask(__name__)
app.debug=True

@app.route("/")
def hello():
    return "Hello World"

@app.route("/lookup/<enc_url>")
def lookup(enc_url):
        url = base64.b64decode(enc_url)
        print(report(annotate(str(url)[2:])))
        return(url)

if __name__ == '__main__':
    app.run(debug=True)

