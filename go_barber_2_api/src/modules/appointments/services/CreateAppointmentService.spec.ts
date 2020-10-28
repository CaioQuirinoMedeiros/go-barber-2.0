import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create an appointment', async () => {
    const date = new Date(2020, 4, 7, 13);
    const provider_id = 'any_provider_id';
    const user_id = 'any_user_id';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 7, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date,
      provider_id,
      user_id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider_id);
  });

  it('should not be able to create two appointments on the same time', async () => {
    const date = new Date(2020, 5, 10, 10);
    const provider_id = 'any_provider_id';
    const user_id = 'any_user_id';

    await fakeAppointmentsRepository.create({ date, provider_id, user_id });

    await expect(
      createAppointmentService.execute({
        date,
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment on a paste date', async () => {
    const date = new Date(2020, 4, 10, 10);
    const provider_id = 'any_provider_id';
    const user_id = 'any_user_id';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date,
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create and appointment with same user as provider', async () => {
    const date = new Date(2020, 4, 10, 13);
    const provider_id = 'same_id';
    const user_id = 'same_id';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date,
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create and appointment before 8am and after 5pm', async () => {
    const tooEarlyDate = new Date(2020, 4, 11, 7);
    const tooLateDate = new Date(2020, 4, 11, 18);
    const provider_id = 'any_provider_id';
    const user_id = 'any_user_id';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: tooEarlyDate,
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      createAppointmentService.execute({
        date: tooLateDate,
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create and appointment on weekend', async () => {
    const weekendDate = new Date(2020, 9, 31, 14);
    const provider_id = 'any_provider_id';
    const user_id = 'any_user_id';

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        date: weekendDate,
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
