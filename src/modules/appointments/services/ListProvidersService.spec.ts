// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list providers', async () => {
    const usersToCreate = [
      {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
      {
        name: 'John Trê',
        email: 'johntre@example.com',
        password: '123456',
      },
      {
        name: 'Loged User',
        email: 'logged@example.com',
        password: '123456',
      },
    ];

    const [user1, user2, user3] = await Promise.all(
      usersToCreate.map(user =>
        fakeUsersRepository.create({
          name: user.name,
          email: user.email,
          password: user.password,
        }),
      ),
    );

    const providers = await listProvidersService.execute({
      user_id: user3.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
