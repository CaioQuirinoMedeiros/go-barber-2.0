import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import HandlebarsMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';
import mailConfig from '@config/mail';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import SGMailProvider from '@shared/container/providers/MailProvider/implementations/SGMailProvider';
import SESMailProvider from '@shared/container/providers/MailProvider/implementations/SESMailProvider';
import SendForgotPasswordEmailService from '../SendForgotPasswordEmailService';

export default function makeSendForgotPasswordEmailService(): SendForgotPasswordEmailService {
  const usersRepository = new UsersRepository();
  const userTokensRepository = new UserTokensRepository();
  const mailTemplateProvider = new HandlebarsMailTemplateProvider();

  let mailProvider: IMailProvider;
  switch (mailConfig.driver) {
    case 'ethereal':
      mailProvider = new EtherealMailProvider(mailTemplateProvider);
      break;
    case 'sendgrid':
      mailProvider = new SGMailProvider(mailTemplateProvider);
      break;
    case 'ses':
      mailProvider = new SESMailProvider(mailTemplateProvider);
      break;
    default:
      mailProvider = new EtherealMailProvider(mailTemplateProvider);
  }

  return new SendForgotPasswordEmailService(
    usersRepository,
    mailProvider,
    userTokensRepository,
  );
}
