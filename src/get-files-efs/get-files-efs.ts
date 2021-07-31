import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getFilesFromFolder } from '../shared/get-files-from-folder/get-files-from-folder';
import { sortFiles } from '../shared/sort-files/sort-files';
import { config } from '../shared/config/config';
import { FileObject } from '../shared/types/types';

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    console.log(`Get the files from the efs folder ${config.efsMountPath}`);

    const files: FileObject[] = await getFilesFromFolder(config.fileKeys, config.efsMountPath);

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
