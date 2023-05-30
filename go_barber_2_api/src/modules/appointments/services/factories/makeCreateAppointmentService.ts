import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';
import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';
import CreateAppointmentService from '../CreateAppointmentService';

export default function makeCreateAppointmentService(): CreateAppointmentService {
  const appointmentsRepository = new AppointmentsRepository();
  const notificationsRepository = new NotificationsRepository();
  const cacheProvider = new RedisCacheProvider();

  return new CreateAppointmentService(
    appointmentsRepository,
    notificationsRepository,
    cacheProvider,
  );
}
