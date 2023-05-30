import { Request, Response } from 'express';

import makeListProviderMonthAvailabilityService from '@modules/appointments/services/factories/makeListProviderMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
  async index(request: Request, response: Response): Promise<Response> {
    const { month, year } = request.query;
    const { provider_id } = request.params;

    const listProviderMonthAvailabilityService = makeListProviderMonthAvailabilityService();

    const providers = await listProviderMonthAvailabilityService.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return response.send(providers);
  }
}
