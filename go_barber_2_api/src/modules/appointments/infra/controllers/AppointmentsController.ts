import { Request, Response } from 'express';

import makeCreateAppointmentService from '@modules/appointments/services/factories/makeCreateAppointmentService';

export default class AppointmentsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;
    const { user_id } = request;

    const createAppointment = makeCreateAppointmentService();

    const appointment = await createAppointment.execute({
      date,
      provider_id,
      user_id,
    });

    return response.send(appointment);
  }
}
