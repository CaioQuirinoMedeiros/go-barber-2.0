import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import makeShowProfileService from '@modules/users/services/factories/makeShowProfileService';
import makeUpdateProfileService from '@modules/users/services/factories/makeUpdateProfileService';

export default class ForgotPasswordController {
  async show(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;

    const showProfile = makeShowProfileService();

    const user = await showProfile.execute({ user_id });

    return response.status(200).send(classToClass(user));
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password, old_password } = request.body;
    const { user_id } = request;

    const updateProfile = makeUpdateProfileService();

    const user = await updateProfile.execute({
      name,
      email,
      password,
      old_password,
      user_id,
    });

    return response.status(200).send(classToClass(user));
  }
}
