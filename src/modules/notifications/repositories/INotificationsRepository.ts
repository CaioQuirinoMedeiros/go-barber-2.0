import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
}
