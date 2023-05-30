import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import BCrypHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';
import UpdateProfileService from '../UpdateProfileService';

export default function makeUpdateProfileService(): UpdateProfileService {
  const usersRepository = new UsersRepository();
  const hashProvider = new BCrypHashProvider();
  const cacheProvider = new RedisCacheProvider();

  return new UpdateProfileService(usersRepository, hashProvider, cacheProvider);
}
