import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import ShowProfileService from '../ShowProfileService';

export default function makeShowProfileService(): ShowProfileService {
  const usersRepository = new UsersRepository();

  return new ShowProfileService(usersRepository);
}
