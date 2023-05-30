import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';
import ListProvidersService from '../ListProvidersService';

export default function makeListProviderService(): ListProvidersService {
  const usersRepository = new UsersRepository();
  const cacheProvider = new RedisCacheProvider();

  return new ListProvidersService(usersRepository, cacheProvider);
}
