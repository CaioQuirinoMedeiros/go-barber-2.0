import BCrypHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import AuthenticateUserService from '../AuthenticateUserService';

export default function makeAuthenticateUserService(): AuthenticateUserService {
  const usersRepository = new UsersRepository();
  const hashProvider = new BCrypHashProvider();

  return new AuthenticateUserService(usersRepository, hashProvider);
}
