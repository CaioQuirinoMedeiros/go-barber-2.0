import { Request, Response } from 'express';

import makeSendForgotPasswordEmailService from '@modules/users/services/factories/makeSendForgotPasswordEmailService';

export default class ForgotPasswordController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordEmailService = makeSendForgotPasswordEmailService();

    await sendForgotPasswordEmailService.execute({ email });

    return response.status(204).send();
  }
}
