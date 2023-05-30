import { getDaysInMonth, getDate, isFuture, getDay } from 'date-fns';

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

class ListProviderMonthAvailabilityService {
  constructor(private appointmentsRepository: IAppointmentsRepository) {}

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
      const compareDate = new Date(year, month - 1, day, 18, 0, 0);

      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );

      const isDataInFuture = isFuture(compareDate);
      const isFullyBooked = appointmentsInDay.length >= 10;
      const isWeekend = getDay(compareDate) === 0 || getDay(compareDate) === 6;

      return {
        day,
        available: isDataInFuture && !isFullyBooked && !isWeekend,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
