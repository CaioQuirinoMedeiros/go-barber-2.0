import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  async update(request: Request, response: Response): Promise<Response> {
    const { user_id, file } = request;

    const updateUserAatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAatar.execute({
      user_id,
      avatarFileName: file.filename,
    });

    return response.send(classToClass(user));
  }
}
