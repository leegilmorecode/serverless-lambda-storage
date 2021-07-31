import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getImagesFromBucket } from '../shared/get-images-from-bucket/get-images-from-bucket';
import { sortFiles } from '../shared/sort-files/sort-files';
import { config } from '../shared/config/config';
import { FileObject } from '../shared/types/types';

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    console.log(`Get the files from the s3 bucket ${config.bucketName}`);

    const files: FileObject[] = await getImagesFromBucket(config.bucketName, config.fileKeys);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          files: sortFiles(files),
        },
        null,
        2,
      ),
    };
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify('An error has been generated', null, 2),
    };
  }
};
