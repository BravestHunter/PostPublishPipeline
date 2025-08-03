import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from './client.js';

const bucket = process.env.S3_BUCKET ?? 'uploads';

export const getObjectUploadUrl = async (
  key: string,
  expires = 60 * 5, // seconds
) => getSignedUrl(s3, new PutObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: expires });

export const getObjectDownloadUrl = async (
  key: string,
  expires = 60 * 5, // seconds
) => getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: expires });

export const deleteObject = (key: string) =>
  s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
