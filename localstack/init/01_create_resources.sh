#!/bin/sh
set -eu

REGION="${AWS_DEFAULT_REGION:-ap-northeast-1}"
BUCKET_NAME="${LOCAL_S3_BUCKET:-hobby-ec-local-bucket}"
SEED_QUEUE_NAME="${LOCAL_SQS_QUEUE_NAME:-hobby-ec-local-queue}"
CONVERSATIONS_TABLE="${CHAT_CONVERSATIONS_TABLE:-ChatConversations}"
MESSAGES_TABLE="${CHAT_MESSAGES_TABLE:-ChatMessages}"
USER_QUEUE_TABLE="${CHAT_USER_QUEUE_TABLE:-ChatUserQueue}"

awslocal s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --create-bucket-configuration "LocationConstraint=$REGION" \
  >/dev/null 2>&1 || true

awslocal sqs create-queue \
  --queue-name "$SEED_QUEUE_NAME" \
  >/dev/null

awslocal dynamodb create-table \
  --table-name "$CONVERSATIONS_TABLE" \
  --attribute-definitions AttributeName=conversationId,AttributeType=S \
  --key-schema AttributeName=conversationId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  >/dev/null 2>&1 || true

awslocal dynamodb create-table \
  --table-name "$MESSAGES_TABLE" \
  --attribute-definitions AttributeName=conversationId,AttributeType=S AttributeName=sortKey,AttributeType=S \
  --key-schema AttributeName=conversationId,KeyType=HASH AttributeName=sortKey,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  >/dev/null 2>&1 || true

awslocal dynamodb create-table \
  --table-name "$USER_QUEUE_TABLE" \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  >/dev/null 2>&1 || true

echo "[localstack-init] ensured bucket=$BUCKET_NAME queue=$SEED_QUEUE_NAME ddb=($CONVERSATIONS_TABLE,$MESSAGES_TABLE,$USER_QUEUE_TABLE)"
