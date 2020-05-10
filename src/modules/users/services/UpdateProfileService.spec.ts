import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const updatedName = `${name}_updated`;
    const updatedEmail = 'johndoe_updated@example.com';

    const user = await fakeUsersRepository.create({ name, email, password });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: updatedName,
      email: updatedEmail,
    });

    expect(updatedUser?.name).toBe(updatedName);
    expect(updatedUser?.email).toBe(updatedEmail);
  });

  it('should not be able to change to another user email', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const updatedName = `${name}_updated`;
    const updatedEmail = 'johndoe_updated@example.com';

    const user = await fakeUsersRepository.create({ name, email, password });

    await fakeUsersRepository.create({ name, email: updatedEmail, password });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: updatedName,
        email: updatedEmail,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const updatedPassword = `${password}_updated`;

    const user = await fakeUsersRepository.create({ name, email, password });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name,
      email,
      password: updatedPassword,
      oldPassword: password,
    });

    expect(updatedUser?.password).toBe(updatedPassword);
  });

  it('should not be able to update non-existing user profile', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';

    await expect(
      updateProfileService.execute({
        user_id: 'non_existing_user',
        name,
        email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password without providing old password', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const updatedPassword = `${password}_updated`;

    const user = await fakeUsersRepository.create({ name, email, password });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name,
        email,
        password: updatedPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with incorrect old password', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const updatedPassword = `${password}_updated`;

    const user = await fakeUsersRepository.create({ name, email, password });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name,
        email,
        password: updatedPassword,
        oldPassword: `${updatedPassword}_incorrect`,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
