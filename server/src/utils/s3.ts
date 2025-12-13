import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { ENV } from "../config/env";

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_REGION,
} = ENV;

if (
  !AWS_ACCESS_KEY_ID ||
  !AWS_SECRET_ACCESS_KEY ||
  !AWS_BUCKET_NAME ||
  !AWS_REGION
) {
  throw new Error(
    "Missing AWS S3 configuration. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME, and AWS_REGION."
  );
}

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadImageToS3(key: string, file: Express.Multer.File) {
  if (!AWS_BUCKET_NAME || !AWS_REGION) {
    throw new Error("AWS bucket or region is not configured");
  }

  const putCommand = new PutObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(putCommand);

  return `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

export async function deleteFromS3(key: string) {
  if (!AWS_BUCKET_NAME) {
    throw new Error("AWS bucket is not configured");
  }

  const deleteCommand = new DeleteObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(deleteCommand);
}
