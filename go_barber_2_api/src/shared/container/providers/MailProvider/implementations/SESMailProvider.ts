import { inject, injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';

import mailConfig from '@config/mail';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({ apiVersion: '2010-12-01', region: 'us-east-1' }),
    });
  }

  public async sendMail(data: ISendMailDTO): Promise<void> {
    const defaultFrom = mailConfig.defaults.from;

    const { from, to, subject, templateData } = data;

    const html = await this.mailTemplateProvider.parse(templateData);

    const response = await this.client.sendMail({
      from: {
        name: from?.name || defaultFrom.name,
        address: from?.email || defaultFrom.email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html,
    });

    console.log('email sent: ', { from, to, subject, response });
  }
}

export default SESMailProvider;
