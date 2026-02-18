export async function GET() {
  const bucketName = process.env.LOCAL_S3_BUCKET ?? 'hobby-ec-local-bucket';
  const queueName = process.env.LOCAL_SQS_QUEUE_NAME ?? 'hobby-ec-local-queue';

  return Response.json({
    ok: true,
    region: process.env.AWS_REGION ?? 'ap-northeast-1',
    endpoint: process.env.AWS_ENDPOINT_URL ?? null,
    s3: {
      bucketName,
      bucketExists: 'unknown'
    },
    sqs: {
      queueName,
      queueExists: 'unknown'
    }
  });
}
