import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });

  it('should be able to recover password using the email', async () => {
    const name = 'cliente';
    const email = 'cliente@exemplo.com';
    const password = '123456';

    await fakeUsersRepository.create({ name, email, password });

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await sendForgotPasswordEmailService.execute({ email });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existent user password', async () => {
    const email = 'cliente@exemplo.com';

    await expect(
      sendForgotPasswordEmailService.execute({ email }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const name = 'cliente';
    const email = 'cliente@exemplo.com';
    const password = '123456';

    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUsersRepository.create({ name, email, password });

    await sendForgotPasswordEmailService.execute({ email: user.email });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
