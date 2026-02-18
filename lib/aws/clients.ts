import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";

const region = process.env.AWS_REGION ?? "ap-northeast-1";
const endpoint = process.env.AWS_ENDPOINT_URL;

const baseConfig = endpoint
  ? {
      region,
      endpoint,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "test",
      },
    }
  : { region };

export const createS3Client = () =>
  new S3Client({
    ...baseConfig,
    forcePathStyle: Boolean(endpoint),
  });

export const createSqsClient = () => new SQSClient(baseConfig);
