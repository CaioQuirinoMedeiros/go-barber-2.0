import { Request, Response } from 'express';

import makeCreateUserService from '@modules/users/services/factories/makeCreateUserService';

export default class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = makeCreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.send(user);
  }
}
