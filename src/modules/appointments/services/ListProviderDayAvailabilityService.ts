import { injectable, inject } from 'tsyringe';
import { getHours } from 'date-fns';

// import User from '@modules/users/infra/typeorm/entities/User';
// import IUserRepository from '@modules/users/repositories/IUserRepository';
// import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

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
  ) {}

  public async execute(request: IRequest): Promise<IResponse> {
    const { provider_id, day, month, year } = request;

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      { provider_id, day, month, year },
    );

    const hourStart = 8;

    const hoursArray = Array.from(
      { length: 10 },
      (element, index) => index + hourStart,
    );

    const availability = hoursArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      return {
        hour,
        available: !hasAppointmentInHour,
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
