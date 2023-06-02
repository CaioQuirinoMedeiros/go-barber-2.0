export default interface IHashProvider {
  saveFile(filename: string): Promise<string>;
  deleteFile(filename: string): Promise<void>;
}
