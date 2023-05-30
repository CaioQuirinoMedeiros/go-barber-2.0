import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import makeAuthenticateUserService from '@modules/users/services/factories/makeAuthenticateUserService';

export default class SessionsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = makeAuthenticateUserService();

    const { user, token } = await authenticateUser.execute({ email, password });

    return response.send({ user: classToClass(user), token });
  }
}
