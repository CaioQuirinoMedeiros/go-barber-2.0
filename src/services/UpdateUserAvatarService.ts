import { getRepository } from 'typeorm';
import path from 'path';
import { promises, exists } from 'fs';

import AppError from '../errors/AppError';
import User from '../models/User';
import { tmpFolder } from '../config/upload';

interface Request {
  user_id: string;
  avatarFileName: string;
}

const existsAsync = (filePath: string): Promise<boolean> =>
  new Promise(resolve => {
    return exists(filePath, resolve);
  });

class UpdateUserAvatarService {
  public async execute(request: Request): Promise<User> {
    const { user_id, avatarFileName } = request;

    const usersRepositories = getRepository(User);

    const user = await usersRepositories.findOne(user_id);

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

    await usersRepositories.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
