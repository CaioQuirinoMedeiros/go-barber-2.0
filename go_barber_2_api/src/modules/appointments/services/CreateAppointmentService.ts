import { startOfHour, isBefore, getHours, format, getDay } from 'date-fns';

import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  date: Date;
  provider_id: string;
  user_id: string;
}

class CreateAppointmentService {
  constructor(
    private appointmentsRepository: IAppointmentsRepository,
    private notificationsRepository: INotificationsRepository,
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(request: IRequest): Promise<Appointment> {
    const { date, provider_id, user_id } = request;

    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You can"t create an appointment on a paste date');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create appointments between 8am adn 5pm',
      );
    }

    if (getDay(appointmentDate) === 0 || getDay(appointmentDate) === 6) {
      throw new AppError('You can\t create an appointment on weekend');
    }

    if (user_id === provider_id) {
      throw new AppError('You can"t create an appointment with yourself');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already is booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
      user_id,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      content: `Novo agendamento para dia ${dateFormatted}`,
      recipient_id: provider_id,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
