from flask import jsonify
from boto3.dynamodb.conditions import Key

class ReportStuffs:
    
    def __init__(self, table_name):
        self.table = table_name

    def queryAvail(self,text):
        response = self.table.query(
                        KeyConditionExpression= Key('Content').eq(text)
                        )
        if response["ResponseMetadata"]["HTTPStatusCode"] == 200:
            if response['Count'] == 0:
                return False
            return True
        return False

    def saveQuery(self,text):
        response = self.table.put_item( 
                            Item={
                                "Content": text,
                                "report_count":1
                                }
                        )
        return response["ResponseMetadata"]["HTTPStatusCode"]

    def updateCount(self,text):
        response = self.table.update_item(
                            Key={
                                'Content': text
                            },
                            UpdateExpression="set report_count = report_count + :inc",
                            ExpressionAttributeValues={
                                ':inc': 1
                            },
                            ReturnValues="UPDATED_NEW"
                        )
        return response["ResponseMetadata"]["HTTPStatusCode"]


    def updateTable(self,text):
        if self.queryAvail(text):
            response = self.updateCount(text)
        else:
            response = self.saveQuery(text)
        return jsonify({"statusCode":response, "text":text})