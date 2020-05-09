import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IMessage {
  to: string;
  body: string;
}

class FakeStorageProvider implements IMailProvider {
  private emails: IMessage[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this.emails.push({ to, body });
  }
}

export default FakeStorageProvider;
