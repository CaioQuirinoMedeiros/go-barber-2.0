import fs from 'fs';
import path from 'path';
import aws from 'aws-sdk';
import mime from 'mime';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: aws.S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  public async saveFile(filename: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, filename);

    const fileContent = await fs.promises.readFile(originalPath);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new AppError('File not found');
    }

    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: filename,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return filename;
  }

  public async deleteFile(filename: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: filename,
      })
      .promise();
  }
}

export default S3StorageProvider;
