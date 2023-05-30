import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import makeListProviderService from '@modules/appointments/services/factories/makeListProviderService';

export default class ProvidersController {
  async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;

    const listProviders = makeListProviderService();

    const providers = await listProviders.execute({ user_id });

    return response.send(classToClass(providers));
  }
}
