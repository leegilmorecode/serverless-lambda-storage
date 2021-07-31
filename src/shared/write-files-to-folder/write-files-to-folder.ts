import { promises as fsp } from 'fs';
import { FileObject } from '../types/types';

export async function writeFilesToFolder(files: FileObject[], folderPath: string): Promise<void> {
  await Promise.all(
    files.map(async (file) => {
      const filePath = `${folderPath}/${file.name}`;

      console.log(`Writing file ${filePath}`);

      await fsp.writeFile(`${filePath}`, file.body as string);
    }),
  );
}
