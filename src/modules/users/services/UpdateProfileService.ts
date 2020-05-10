import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  oldPassword?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(request: IRequest): Promise<User> {
    const { user_id, name, email, password, oldPassword } = request;

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    if (email !== user.email) {
      const userWithUpdatedEmail = await this.usersRepository.findByEmail(
        email,
      );

      console.log({ email, emailALready: user.email, userWithUpdatedEmail });
      if (userWithUpdatedEmail) {
        throw new AppError('E-mail already in use');
      }
    }

    user.name = name;
    user.email = email;

    if (password) {
      if (!oldPassword) {
        throw new AppError('You should inform your actual password');
      }

      const passwordMatch = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      );

      if (!passwordMatch) {
        throw new AppError('Your password is incorrect');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
