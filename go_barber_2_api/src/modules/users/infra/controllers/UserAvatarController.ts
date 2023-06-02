import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import makeUpdateUserAvatarService from '@modules/users/services/factories/makeUpdateUserAvatarService';
import makeDeleteUserAvatarService from '@modules/users/services/factories/makeDeleteUserAvatarService';

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

  async delete(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;

    const deleteUserAvatar = makeDeleteUserAvatarService();

    const user = await deleteUserAvatar.execute({
      user_id,
    });

    return response.send(classToClass(user));
  }
}
