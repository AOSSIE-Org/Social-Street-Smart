from flask import Blueprint, request, jsonify
import base64
import os
import json
import sys
import imageLookup as imgL  # Ensure this matches the actual module name

# Define the Blueprints
main_bp = Blueprint('main', __name__)
lookup_bp = Blueprint('lookup', __name__)

@main_bp.route("/", methods=["GET"])
def hello():
    return "Hello World"

@lookup_bp.route("/", methods=["GET"])
def lookup():
    enc_url = request.args.get('link')
    creds = request.args.get('creds')
    
    # Decode and set Google Application Credentials
    try:
        if creds:
            creds = base64.b64decode(creds).decode("utf-8")
            creds = json.loads(creds)
            with open('/tmp/GoogleAppCreds.json', 'w') as outfile:
                json.dump(creds, outfile)
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/tmp/GoogleAppCreds.json"
        else:
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./GoogleAppCreds.json"
        
        print("Credentials set up successfully", file=sys.stderr)
    except Exception as e:
        print(f"Error setting credentials: {e}", file=sys.stderr)
        return jsonify({"error": "Failed to set Google credentials"}), 500
    
    if not enc_url:
        return jsonify({"error": "No URL provided"}), 400
    
    try:
        # Annotate the image and generate a report
        annotated_result = imgL.annotate(enc_url)
        res = imgL.report(annotated_result)
        print("Result", file=sys.stderr)
        print(jsonify(res), file=sys.stderr)
    except Exception as e:
        print(f"Error processing image: {e}", file=sys.stderr)
        return jsonify({"error": "Failed to process image"}), 500
    
    try:
        os.remove("/tmp/GoogleAppCreds.json")
    except Exception as e:
        print(f"Error removing temporary credentials file: {e}", file=sys.stderr)
    
    return jsonify(res), 200
