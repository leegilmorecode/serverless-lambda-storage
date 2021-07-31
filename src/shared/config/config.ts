interface Config {
  bucketName: string;
  fileKeys: string[];
  efsMountPath: string;
  tmpPath: string;
}

export const config: Config = {
  bucketName: process.env.BUCKET_NAME || '',
  fileKeys: ['1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg'],
  efsMountPath: process.env.EFS_MOUNT_PATH || '/mnt/images',
  tmpPath: '/tmp',
};
