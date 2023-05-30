import { Request, Response } from 'express';

import makeResetPasswordService from '@modules/users/services/factories/makeResetPasswordService';

export default class ResetPasswordController {
  async create(request: Request, response: Response): Promise<Response> {
    const { token, password } = request.body;

    const resetPasswordService = makeResetPasswordService();

    await resetPasswordService.execute({ token, password });

    return response.status(204).send();
  }
}
