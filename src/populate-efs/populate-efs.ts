import { Handler } from 'aws-lambda';
import { getImagesFromBucket } from '../shared/get-images-from-bucket/get-images-from-bucket';
import { writeFilesToFolder } from '../shared/write-files-to-folder/write-files-to-folder';
import { getFilesFromFolder } from '../shared/get-files-from-folder/get-files-from-folder';
import { config } from '../shared/config/config';
import { FileObject } from '../shared/types/types';

export const handler: Handler = async (): Promise<void> => {
  // Note: this lambda is invoked from the end of the sls deploy using hooks and scripts
  try {
    console.log(`Get the images from efs in ${config.efsMountPath}`);

    const files: FileObject[] = await getFilesFromFolder(config.fileKeys, config.efsMountPath);

    // if no files currently on efs share then get them from s3 and populate them
    if (!files.length) {
      console.log(
        `No images found in efs folder ${config.efsMountPath} so writing them from bucket ${config.bucketName}`,
      );

      const files: FileObject[] = await getImagesFromBucket(config.bucketName, config.fileKeys);

      console.log(`Write images to efs folder ${config.efsMountPath}`);

      await writeFilesToFolder(files, config.efsMountPath);
    }

    console.log(`Images already populated in efs folder ${config.efsMountPath}`);
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};
