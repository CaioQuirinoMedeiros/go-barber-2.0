import BCrypHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';
import CreateUserService from '../CreateUserService';

export default function makeCreateUserService(): CreateUserService {
  const usersRepository = new UsersRepository();
  const hashProvider = new BCrypHashProvider();
  const cacheProvider = new RedisCacheProvider();

  return new CreateUserService(usersRepository, hashProvider, cacheProvider);
}
