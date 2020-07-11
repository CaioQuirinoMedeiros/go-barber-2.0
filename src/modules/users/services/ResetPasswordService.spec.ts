import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokenRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset password', async () => {
    const name = 'cliente';
    const email = 'cliente@exemplo.com';
    const password = '123456';

    const user = await fakeUsersRepository.create({ name, email, password });

    const userToken = await fakeUserTokenRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      token: userToken.token,
      password: '123123',
    });

    const updateUser = await fakeUsersRepository.findById(user.id);

    expect(updateUser?.password).toBe('123123');
    expect(generateHash).toHaveBeenCalledWith('123123');
  });

  it('should not be able to reset password with nox-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non_existing_user',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password with nox-existing user', async () => {
    const userToken = await fakeUserTokenRepository.generate(
      'non_existing_user',
    );

    await expect(
      resetPasswordService.execute({
        token: userToken.token,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if passed more than 2 hours', async () => {
    const name = 'cliente';
    const email = 'cliente@exemplo.com';
    const password = '123456';

    const user = await fakeUsersRepository.create({ name, email, password });

    const userToken = await fakeUserTokenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const now = new Date();

      return now.setHours(now.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        token: userToken.token,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
