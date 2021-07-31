import { promises as fsp } from 'fs';
import { FileObject } from '../types/types';

export async function getFilesFromFolder(fileKeys: string[], folderPath: string): Promise<FileObject[]> {
  try {
    const files: FileObject[] = [];

    console.log(`Attempting to read files from ${folderPath}`);

    await Promise.all(
      fileKeys.map(async (file) => {
        const localFile = await fsp.readFile(`${folderPath}/${file}`);

        if (localFile) {
          console.log(`${file} is already in ${folderPath}`);

          files.push({ name: file, body: localFile.toString() });
        } else {
          console.log(`${file} is not currently in ${folderPath}`);
        }
      }),
    );

    return files;
  } catch (error) {
    // if we get any error regarding no files or directory from the four images then swallow it as we need all images
    if (error.message.includes('ENOENT: no such file or directory')) {
      console.log(`No files in ${folderPath}`);
      return [];
    }
    // if unknown error then rethrow it
    throw error;
  }
}
