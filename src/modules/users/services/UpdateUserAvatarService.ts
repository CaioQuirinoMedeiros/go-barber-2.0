import path from 'path';
import { promises, exists } from 'fs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import { tmpFolder } from '@config/upload';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

const existsAsync = (filePath: string): Promise<boolean> =>
  new Promise(resolve => {
    return exists(filePath, resolve);
  });

@injectable()
class UpdateUserAvatarService {
  private usersRepository: UsersRepository;

  constructor(@inject('UsersRepository') usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute(request: IRequest): Promise<User> {
    const { user_id, avatarFileName } = request;

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(tmpFolder, user.avatar);
      const userAvatarFileExists = await existsAsync(userAvatarFilePath);

      if (userAvatarFileExists) {
        await promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
