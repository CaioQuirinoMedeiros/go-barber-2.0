import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import { forgotPasswordTemplate } from '@shared/infra/http/server';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  private usersRepository: IUserRepository;

  private mailProvider: IMailProvider;

  private userTokenRepository: IUserTokenRepository;

  constructor(
    usersRepository: IUserRepository,
    mailProvider: IMailProvider,
    userTokenRepository: IUserTokenRepository,
  ) {
    this.usersRepository = usersRepository;
    this.mailProvider = mailProvider;
    this.userTokenRepository = userTokenRepository;
  }

  public async execute(request: IRequest): Promise<void> {
    const { email } = request;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const userToken = await this.userTokenRepository.generate(user.id);

    await this.mailProvider.sendMail({
      to: { name: user.name, email: user.email },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${userToken.token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
