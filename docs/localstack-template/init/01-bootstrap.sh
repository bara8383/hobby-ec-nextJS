#!/usr/bin/env bash
set -euo pipefail

AWS="awslocal --region ap-northeast-1"

# 1) S3 bucket for static hosting
$AWS s3api create-bucket \
  --bucket local-ec-frontend \
  --create-bucket-configuration LocationConstraint=ap-northeast-1 || true

# 2) DynamoDB tables
$AWS dynamodb create-table \
  --table-name Products \
  --attribute-definitions AttributeName=productId,AttributeType=S \
  --key-schema AttributeName=productId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST || true

$AWS dynamodb create-table \
  --table-name Orders \
  --attribute-definitions AttributeName=orderId,AttributeType=S \
  --key-schema AttributeName=orderId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST || true

# 3) Seed products
$AWS dynamodb put-item --table-name Products --item '{
  "productId": {"S": "sku-001"},
  "name": {"S": "LocalStack T-Shirt"},
  "price": {"N": "2980"},
  "stock": {"N": "42"}
}'

$AWS dynamodb put-item --table-name Products --item '{
  "productId": {"S": "sku-002"},
  "name": {"S": "Serverless Mug"},
  "price": {"N": "1680"},
  "stock": {"N": "100"}
}'

# 4) IAM role for Lambda
$AWS iam create-role \
  --role-name local-lambda-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {"Service": "lambda.amazonaws.com"},
        "Action": "sts:AssumeRole"
      }
    ]
  }' || true

$AWS iam attach-role-policy \
  --role-name local-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole || true

# 5) Lambda deploy
cd /opt/localstack/lambda/product-api
zip -r function.zip index.py > /dev/null

$AWS lambda create-function \
  --function-name product-api \
  --runtime python3.11 \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --timeout 15 \
  --memory-size 256 \
  --role arn:aws:iam::000000000000:role/local-lambda-role \
  --environment Variables='{PRODUCTS_TABLE=Products,ORDERS_TABLE=Orders}' || true

# 6) API Gateway REST API
REST_API_ID=$($AWS apigateway create-rest-api --name ec-local-api --query id --output text)
ROOT_ID=$($AWS apigateway get-resources --rest-api-id "$REST_API_ID" --query 'items[0].id' --output text)

PRODUCTS_ID=$($AWS apigateway create-resource --rest-api-id "$REST_API_ID" --parent-id "$ROOT_ID" --path-part products --query id --output text)
ORDERS_ID=$($AWS apigateway create-resource --rest-api-id "$REST_API_ID" --parent-id "$ROOT_ID" --path-part orders --query id --output text)

for RID in "$PRODUCTS_ID" "$ORDERS_ID"; do
  METHOD="GET"
  if [ "$RID" = "$ORDERS_ID" ]; then METHOD="POST"; fi

  $AWS apigateway put-method \
    --rest-api-id "$REST_API_ID" \
    --resource-id "$RID" \
    --http-method "$METHOD" \
    --authorization-type "NONE"

  URI="arn:aws:apigateway:ap-northeast-1:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-northeast-1:000000000000:function:product-api/invocations"

  $AWS apigateway put-integration \
    --rest-api-id "$REST_API_ID" \
    --resource-id "$RID" \
    --http-method "$METHOD" \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "$URI"

done

$AWS lambda add-permission \
  --function-name product-api \
  --statement-id apigw-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:ap-northeast-1:000000000000:${REST_API_ID}/*/*/*" || true

$AWS apigateway create-deployment --rest-api-id "$REST_API_ID" --stage-name dev > /dev/null

echo "REST API URL: http://localhost:4566/restapis/${REST_API_ID}/dev/_user_request_"
