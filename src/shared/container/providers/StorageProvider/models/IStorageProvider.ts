export default interface IHashProvider {
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
