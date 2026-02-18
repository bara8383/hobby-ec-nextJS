#!/bin/sh
set -eu

REGION="${AWS_DEFAULT_REGION:-ap-northeast-1}"
BUCKET_NAME="${LOCAL_S3_BUCKET:-hobby-ec-local-bucket}"
QUEUE_NAME="${LOCAL_SQS_QUEUE_NAME:-hobby-ec-local-queue}"

awslocal s3api create-bucket \
  --bucket "$BUCKET_NAME" \
  --create-bucket-configuration "LocationConstraint=$REGION" \
  >/dev/null 2>&1 || true

awslocal sqs create-queue \
  --queue-name "$QUEUE_NAME" \
  >/dev/null

echo "[localstack-init] ensured bucket=$BUCKET_NAME queue=$QUEUE_NAME"
