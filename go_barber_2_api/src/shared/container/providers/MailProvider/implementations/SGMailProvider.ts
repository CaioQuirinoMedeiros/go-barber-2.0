import sgMail, { MailService } from '@sendgrid/mail';

import mailConfig from '@config/mail';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

class SGMailProvider implements IMailProvider {
  private client: MailService;

  constructor(private mailTemplateProvider: IMailTemplateProvider) {
    this.client = sgMail;
    if (process.env.SENDGRID_API_KEY) {
      this.client.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  public async sendMail(data: ISendMailDTO): Promise<void> {
    const defaultFrom = mailConfig.defaults.from;

    const { from, to, subject, templateData } = data;

    const html = await this.mailTemplateProvider.parse(templateData);

    const response = await this.client.send({
      from: {
        name: from?.name || defaultFrom.name,
        email: from?.email || defaultFrom.email,
      },
      to: {
        name: to.name,
        email: to.email,
      },
      subject,
      html,
    });

    console.log(response, from, to, subject);
  }
}

export default SGMailProvider;
