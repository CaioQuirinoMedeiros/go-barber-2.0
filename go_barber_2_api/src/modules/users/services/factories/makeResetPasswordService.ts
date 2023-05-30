import BCrypHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import ResetPasswordService from '../ResetPasswordService';

export default function makeResetPasswordService(): ResetPasswordService {
  const usersRepository = new UsersRepository();
  const userTokensRepository = new UserTokensRepository();
  const hashProvider = new BCrypHashProvider();

  return new ResetPasswordService(
    usersRepository,
    userTokensRepository,
    hashProvider,
  );
}
