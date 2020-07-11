import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(request: IRequest): Promise<IResponse> {
    const { provider_id, month, year } = request;

    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      { provider_id, month, year },
    );

    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    const daysInMonthArray = Array.from(
      { length: daysInMonth },
      (element, index) => index + 1,
    );

    const availability = daysInMonthArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );

      return {
        day,
        available:
          !isAfter(new Date(), compareDate) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
