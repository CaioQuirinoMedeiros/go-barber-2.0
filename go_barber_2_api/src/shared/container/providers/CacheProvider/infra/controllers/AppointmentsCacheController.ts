import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

export default class AppointmentsCacheController {
  async destroy(request: Request, response: Response): Promise<Response> {
    const cacheProvider = container.resolve<ICacheProvider>('CacheProvider');

    await cacheProvider.invalidatePrefix('provider-appointments');

    return response.send();
  }
}
