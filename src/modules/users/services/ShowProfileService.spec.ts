import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show profile', async () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = '123456';

    const user = await fakeUsersRepository.create({ name, email, password });

    const profile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(profile?.name).toBe(name);
    expect(profile?.email).toBe(email);
  });

  it('should be able to show profile of non-existing user', async () => {
    await expect(
      showProfileService.execute({
        user_id: 'non_existing_user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
