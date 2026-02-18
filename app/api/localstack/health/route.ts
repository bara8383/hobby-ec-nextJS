import { HeadBucketCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import {
  GetQueueAttributesCommand,
  GetQueueUrlCommand,
  ListQueuesCommand,
} from "@aws-sdk/client-sqs";

import { createS3Client, createSqsClient } from "@/lib/aws/clients";

export async function GET() {
  const bucketName = process.env.LOCAL_S3_BUCKET ?? "hobby-ec-local-bucket";
  const queueName = process.env.LOCAL_SQS_QUEUE_NAME ?? "hobby-ec-local-queue";
  const queueUrlFromEnv = process.env.LOCAL_SQS_QUEUE_URL;

  const s3Client = createS3Client();
  const sqsClient = createSqsClient();

  try {
    const buckets = await s3Client.send(new ListBucketsCommand({}));
    const bucketExists =
      buckets.Buckets?.some((bucket) => bucket.Name === bucketName) ?? false;

    if (!bucketExists) {
      await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    }

    let queueUrl = queueUrlFromEnv;

    if (!queueUrl) {
      const listResult = await sqsClient.send(
        new ListQueuesCommand({ QueueNamePrefix: queueName }),
      );
      queueUrl =
        listResult.QueueUrls?.find((url) => url.endsWith(`/${queueName}`)) ??
        undefined;
    }

    if (!queueUrl) {
      const queueResult = await sqsClient.send(
        new GetQueueUrlCommand({ QueueName: queueName }),
      );
      queueUrl = queueResult.QueueUrl;
    }

    if (!queueUrl) {
      throw new Error(`SQS queue not found: ${queueName}`);
    }

    await sqsClient.send(
      new GetQueueAttributesCommand({
        QueueUrl: queueUrl,
        AttributeNames: ["QueueArn"],
      }),
    );

    return Response.json({
      ok: true,
      region: process.env.AWS_REGION ?? "ap-northeast-1",
      endpoint: process.env.AWS_ENDPOINT_URL ?? null,
      s3: {
        bucketName,
        bucketExists: true,
      },
      sqs: {
        queueName,
        queueUrl,
        queueExists: true,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return Response.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
