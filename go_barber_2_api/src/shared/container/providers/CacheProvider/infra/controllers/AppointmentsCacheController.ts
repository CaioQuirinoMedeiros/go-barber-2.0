import { Request, Response } from 'express';

import RedisCacheProvider from '../../implementations/RedisCacheProvider';

export default class AppointmentsCacheController {
  async destroy(request: Request, response: Response): Promise<Response> {
    const cacheProvider = new RedisCacheProvider();

    await cacheProvider.invalidatePrefix('provider-appointments');

    return response.send();
  }
}
