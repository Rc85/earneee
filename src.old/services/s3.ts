import { S3 } from '@aws-sdk/client-s3';

export const s3 = new S3({
  endpoint: `https://${process.env.S3_ENDPOINT}`,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ''
  }
});
