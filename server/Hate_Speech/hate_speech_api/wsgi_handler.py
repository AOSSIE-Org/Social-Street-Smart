import json
import serverless_wsgi
import app from app

def handler(event, context):
    print("Received event:", json.dumps(event, indent=2))
    
    if "headers" not in event:
        event["headers"] = {}
    
    return serverless_wsgi.handle_request(app, event, context)
