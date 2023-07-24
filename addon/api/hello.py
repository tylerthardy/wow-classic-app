import json
import boto3
import os
import simplejson as json
from boto3.dynamodb.conditions import Key, Attr
from boto3.dynamodb.types import TypeDeserializer

TABLE_NAME_PROPERTY = "DYNAMO_PLAYER_TABLE_NAME"
PLAYER_TABLE_NAME = os.environ[TABLE_NAME_PROPERTY]

ddb = boto3.resource("dynamodb")
table = ddb.Table(PLAYER_TABLE_NAME)


def handler(event, context):
    print("request: {}".format(json.dumps(event)))

    results = []

    response = table.query(
        KeyConditionExpression=Key("regionServerCharacterName").eq(
            "us-benediction-werterter"
        )
    )
    items = response["Items"]
    # print(items)
    # for item in items:
    #     print(item)
    #     results.append(dynamo_obj_to_python_obj(item))

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "text/plain"},
        "body": "Hello! You have hit {}\n{}\n".format(event["path"], json.dumps(items)),
    }


def dynamo_obj_to_python_obj(dynamo_obj: dict) -> dict:
    deserializer = TypeDeserializer()
    return {k: deserializer.deserialize(v) for k, v in dynamo_obj.items()}
