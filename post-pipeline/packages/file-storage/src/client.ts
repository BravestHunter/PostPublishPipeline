import { S3Client } from '@aws-sdk/client-s3';

const {
  S3_ENDPOINT = 'http://localhost:9000',
  S3_ACCESS_KEY = 'minio',
  S3_SECRET_KEY = 'minio123',
} = process.env;

export const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  region: 'us-east-1', // any string for MinIO
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  forcePathStyle: true,
});
