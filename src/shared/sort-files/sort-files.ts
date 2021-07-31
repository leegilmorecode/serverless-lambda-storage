import { FileObject } from '../types/types';

export function sortFiles(files: FileObject[]): FileObject[] {
  return files.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
}
