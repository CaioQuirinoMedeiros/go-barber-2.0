import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IUsersRepository from '@modules/users/repositories/IUserRepository';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(request: IRequest): Promise<IResponse> {
    const { provider_id, day, month, year } = request;

    const user = await this.usersRepository.findById(provider_id)

    if (!user) {
      throw new AppError('Provider not found')
    }

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      { provider_id, day, month, year },
    );

    const hourStart = 8;

    const hoursArray = Array.from(
      { length: 10 },
      (element, index) => index + hourStart,
    );

    const availability = hoursArray.map(hour => {
      const hasAppointmentInHour = appointments.find(appointment => {
        return getHours(appointment.date) === hour;
      });

      const currentDate = new Date(Date.now());
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
