import json
import os
import uuid
import boto3

region = "ap-northeast-1"
dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url="http://localstack:4566",
    region_name=region,
    aws_access_key_id="test",
    aws_secret_access_key="test",
)

products_table = dynamodb.Table(os.environ.get("PRODUCTS_TABLE", "Products"))
orders_table = dynamodb.Table(os.environ.get("ORDERS_TABLE", "Orders"))


def response(status, body):
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body, ensure_ascii=False),
    }


def handler(event, context):
    path = event.get("path", "")
    method = event.get("httpMethod", "GET")

    if path.endswith("/products") and method == "GET":
        items = products_table.scan().get("Items", [])
        return response(200, {"items": items})

    if path.endswith("/orders") and method == "POST":
        payload = json.loads(event.get("body") or "{}")
        order_id = str(uuid.uuid4())
        item = {
            "orderId": order_id,
            "productId": payload.get("productId", "sku-001"),
            "quantity": int(payload.get("quantity", 1)),
            "status": "CREATED",
        }
        orders_table.put_item(Item=item)
        return response(201, item)

    return response(404, {"message": "Not found"})
