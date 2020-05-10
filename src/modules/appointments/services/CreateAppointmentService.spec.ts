import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create an appointment', async () => {
    const date = new Date();
    const provider_id = '123456';

    const appointment = await createAppointmentService.execute({
      date,
      provider_id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider_id);
  });

  it('should not be able to create two appointments on the same time', async () => {
    const date = new Date(2020, 5, 10, 10);
    const provider_id = '123456';

    await fakeAppointmentsRepository.create({ date, provider_id });

    expect(
      createAppointmentService.execute({
        date,
        provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
