import AWS from 'aws-sdk';
import { FileObject } from '../types/types';

type GetObjectOutput = AWS.S3.GetObjectOutput;

const s3 = new AWS.S3();

export async function getImagesFromBucket(bucket: string, fileKeys: string[]): Promise<FileObject[]> {
  const files: FileObject[] = [];

  // retrieve all of the images based on the keys from an s3 bucket
  await Promise.all(
    fileKeys.map(async (key) => {
      const { Body: body }: GetObjectOutput = await s3.getObject({ Bucket: bucket, Key: key }).promise();
      const fileObject: FileObject = { name: key, body: body?.toString('base64') };
      files.push(fileObject);
    }),
  );

  return files;
}
