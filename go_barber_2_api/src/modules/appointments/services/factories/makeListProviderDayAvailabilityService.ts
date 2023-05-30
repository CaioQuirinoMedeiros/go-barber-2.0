import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import ListProviderDayAvailabilityService from '../ListProviderDayAvailabilityService';

export default function makeListProviderDayAvailabilityService(): ListProviderDayAvailabilityService {
  const appointmentsRepository = new AppointmentsRepository();
  const usersRepository = new UsersRepository();

  return new ListProviderDayAvailabilityService(
    appointmentsRepository,
    usersRepository,
  );
}
