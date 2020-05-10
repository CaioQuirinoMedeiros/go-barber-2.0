import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ForgotPasswordController {
  async show(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ user_id });

    return response.status(200).send(user);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password, oldPassword } = request.body;
    const { user_id } = request;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      name,
      email,
      password,
      oldPassword,
      user_id,
    });

    return response.status(200).send(user);
  }
}
