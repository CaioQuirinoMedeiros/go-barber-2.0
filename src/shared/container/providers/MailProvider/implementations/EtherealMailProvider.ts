import { inject, injectable } from 'tsyringe';

import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendMail(data: ISendMailDTO): Promise<void> {
    const { from, to, subject, templateData } = data;

    const html = await this.mailTemplateProvider.parse(templateData);

    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Caio Medeiros',
        address: from?.email || 'caio.quirino.medeiros@gmail.com',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html,
    });

    console.log(`Message sent: ${message.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`);
  }
}

export default EtherealMailProvider;
