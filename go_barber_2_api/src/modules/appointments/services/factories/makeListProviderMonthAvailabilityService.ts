import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import ListProviderMonthAvailabilityService from '../ListProviderMonthAvailabilityService';

export default function makeListProviderMonthAvailabilityService(): ListProviderMonthAvailabilityService {
  const appointmentsRepository = new AppointmentsRepository();

  return new ListProviderMonthAvailabilityService(appointmentsRepository);
}
