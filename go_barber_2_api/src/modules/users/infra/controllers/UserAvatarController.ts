import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import makeUpdateUserAvatarService from '@modules/users/services/factories/makeUpdateUserAvatarService';

export default class UserAvatarController {
  async update(request: Request, response: Response): Promise<Response> {
    const { user_id, file } = request;

    const updateUserAvatar = makeUpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      user_id,
      avatarFileName: file.filename,
    });

    return response.send(classToClass(user));
  }
}
