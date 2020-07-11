import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    this.storage = this.storage.filter(findFile => findFile !== file);
  }
}

export default FakeStorageProvider;
