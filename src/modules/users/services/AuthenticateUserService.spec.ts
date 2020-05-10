import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    await createUserService.execute({
      name,
      email,
      password,
    });

    const response = await authenticateUserService.execute({
      email,
      password,
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('user');
    expect(response.user.email).toBe(email);
  });

  it('should not be able to authenticate inexistent user', async () => {
    const email = 'johndoe@example.com';
    const password = '123456';

    await expect(
      authenticateUserService.execute({
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with invalid password', async () => {
    const name = 'Trevis';
    const email = 'trevis@example.com';
    const password = '123456';

    await createUserService.execute({
      name,
      email,
      password,
    });

    await expect(
      authenticateUserService.execute({
        email,
        password: `${password}_2`,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
