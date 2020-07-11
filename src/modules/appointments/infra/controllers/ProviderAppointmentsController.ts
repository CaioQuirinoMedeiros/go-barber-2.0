import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  async index(request: Request, response: Response): Promise<Response> {
    const { month, day, year } = request.query;
    const { user_id } = request;

    const listProviderAppointmentsService = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listProviderAppointmentsService.execute({
      provider_id: user_id,
      month: Number(month),
      day: Number(day),
      year: Number(year),
    });

    return response.send(classToClass(appointments));
  }
}
