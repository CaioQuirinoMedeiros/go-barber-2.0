import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import makeListProviderAppointmentsService from '@modules/appointments/services/factories/makeListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  async index(request: Request, response: Response): Promise<Response> {
    const { month, day, year } = request.query;
    const { user_id } = request;

    const listProviderAppointmentsService = makeListProviderAppointmentsService();

    const appointments = await listProviderAppointmentsService.execute({
      provider_id: user_id,
      month: Number(month),
      day: Number(day),
      year: Number(year),
    });

    return response.send(classToClass(appointments));
  }
}
