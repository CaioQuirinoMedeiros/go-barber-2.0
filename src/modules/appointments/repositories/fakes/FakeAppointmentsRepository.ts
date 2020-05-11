import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import { uuid } from 'uuidv4';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]> {
    const { provider_id, year, month, day } = data;

    const appointments = this.appointments.filter(appointment => {
      const appointmentMonth = getMonth(appointment.date) + 1;
      const appointmentYear = getYear(appointment.date);
      const appointmentDay = getDate(appointment.date);

      return (
        appointment.provider_id === provider_id &&
        appointmentDay === day &&
        appointmentMonth === month &&
        appointmentYear === year
      );
    });

    return appointments;
  }

  public async findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]> {
    const { provider_id, year, month } = data;

    const appointments = this.appointments.filter(appointment => {
      const appointmentMonth = getMonth(appointment.date) + 1;
      const appointmentYear = getYear(appointment.date);

      return (
        appointment.provider_id === provider_id &&
        appointmentMonth === month &&
        appointmentYear === year
      );
    });

    return appointments;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );

    return findAppointment;
  }

  public async create(createData: ICreateAppointmentDTO): Promise<Appointment> {
    const { date, provider_id, user_id } = createData;

    const appointment = new Appointment();

    Object.assign(appointment, {
      id: uuid(),
      date,
      provider_id,
      user_id,
    });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
