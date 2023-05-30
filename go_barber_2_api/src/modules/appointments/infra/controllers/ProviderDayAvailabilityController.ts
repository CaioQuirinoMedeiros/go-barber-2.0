import { Request, Response } from 'express';

import makeListProviderDayAvailabilityService from '@modules/appointments/services/factories/makeListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  async index(request: Request, response: Response): Promise<Response> {
    const { month, day, year } = request.query;
    const { provider_id } = request.params;

    const listProviderDayAvailabilityService = makeListProviderDayAvailabilityService();

    const providers = await listProviderDayAvailabilityService.execute({
      provider_id,
      month: Number(month),
      day: Number(day),
      year: Number(year),
    });

    return response.send(providers);
  }
}
