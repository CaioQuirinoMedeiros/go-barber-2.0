import { container } from 'tsyringe';

import mailConfig from '@config/mail';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import SGMailProvider from './implementations/SGMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  sendgrid: container.resolve(SGMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
