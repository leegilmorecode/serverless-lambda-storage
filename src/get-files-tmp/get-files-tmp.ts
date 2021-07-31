import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getImagesFromBucket } from '../shared/get-images-from-bucket/get-images-from-bucket';
import { getFilesFromFolder } from '../shared/get-files-from-folder/get-files-from-folder';
import { writeFilesToFolder } from '../shared/write-files-to-folder/write-files-to-folder';
import { sortFiles } from '../shared/sort-files/sort-files';
import { FileObject } from '../shared/types/types';
import { config } from '../shared/config/config';

async function getFiles(): Promise<FileObject[]> {
  // attempt to get the files from /tmp on the lambda
  const files: FileObject[] = await getFilesFromFolder(config.fileKeys, config.tmpPath);

  // if no files are currently in tmp then populate them from s3 so cached going forward
  if (!files.length) {
    return await populateTempFromS3();
  }

  console.log(`Returning files from ${config.tmpPath} as they are already cached`);

  return files;
}

async function populateTempFromS3(): Promise<FileObject[]> {
  console.log(`Getting files from S3 as they are not cached in ${config.tmpPath}`);

  const files: FileObject[] = await getImagesFromBucket(config.bucketName, config.fileKeys);

  console.log(`Writing files into ${config.tmpPath} from S3`);

  await writeFilesToFolder(files, config.tmpPath);

  return files;
}

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    console.log(`Getting the files from the ${config.tmpPath} folder`);

    const files: FileObject[] = await getFiles();

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
  } catch (error) {
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
