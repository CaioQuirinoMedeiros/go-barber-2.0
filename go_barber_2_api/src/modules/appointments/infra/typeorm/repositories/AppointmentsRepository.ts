import { getRepository, Repository, Between } from 'typeorm';
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]> {
    const { provider_id, day, month, year } = data;

    const startDate = startOfDay(new Date(year, month - 1, day));
    const endDate = endOfDay(new Date(year, month - 1, day));

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Between(startDate, endDate),
      },
      relations: ['user'],
    });

    return appointments;
  }

  public async findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]> {
    const { provider_id, month, year } = data;

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Between(
          startOfMonth(new Date(year, month)),
          endOfMonth(new Date(year, month)),
        ),
      },
    });

    return appointments;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  }

  public async create(createData: ICreateAppointmentDTO): Promise<Appointment> {
    const { provider_id, date, user_id } = createData;

    const appointment = this.ormRepository.create({
      provider_id,
      date,
      user_id,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
