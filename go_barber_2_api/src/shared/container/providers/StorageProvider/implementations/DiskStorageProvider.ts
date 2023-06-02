import fs from 'fs';
import path from 'path';

import configUpload from '@config/upload';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(filename: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(configUpload.tmpFolder, filename),
      path.resolve(configUpload.uploadsFolder, filename),
    );

    return filename;
  }

  public async deleteFile(filename: string): Promise<void> {
    const filePath = path.resolve(configUpload.uploadsFolder, filename);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;
