import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update avatar', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const user = await fakeUsersRepository.create({ name, email, password });

    const updatedUser = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'imagem.jpg',
    });

    expect(updatedUser).toHaveProperty('avatar');
    expect(updatedUser.avatar).toBe('imagem.jpg');
  });

  it('should not be able to update avatar of inexistent user', async () => {
    await expect(
      updateUserAvatarService.execute({
        user_id: 'inexistent_id',
        avatarFileName: 'imagem.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update avatar of user that already have an avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';
    const avatar = 'avatar.jpg';

    const user = await fakeUsersRepository.create({ name, email, password });

    user.avatar = avatar;

    await fakeUsersRepository.save(user);

    const updatedUser = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'imagem.jpg',
    });

    expect(updatedUser).toHaveProperty('avatar');
    expect(updatedUser.avatar).toBe('imagem.jpg');
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
  });
});
