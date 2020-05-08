import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  async update(request: Request, response: Response): Promise<Response> {
    const { user_id, file } = request;

    const updateUserAatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAatar.execute({
      user_id,
      avatarFileName: file.filename,
    });

    delete user.password;

    return response.send(user);
  }
}
