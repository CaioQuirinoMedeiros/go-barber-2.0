import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a user', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const user = await createUserService.execute({
      name,
      email,
      password,
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe(email);
  });

  it('should not be able to create a user with same email from another', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    await fakeUsersRepository.create({ name, email, password });

    await expect(
      createUserService.execute({
        name: `${name}_2`,
        email,
        password: `${password}_2`,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
