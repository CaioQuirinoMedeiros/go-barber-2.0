// import AppError from '@shared/errors/AppError';
// import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

// let fakeUsersRepository: FakeUsersRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    // fakeUsersRepository = new FakeUsersRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list providers', async () => {
    const appointmentsToCreate = [
      {
        date: new Date(2020, 4, 10, 8, 0, 0),
        provider_id: 'anything',
      },
      {
        date: new Date(2020, 4, 10, 10, 0, 0),
        provider_id: 'anything',
      },
    ];

    await Promise.all(
      appointmentsToCreate.map(async appointment => {
        await fakeAppointmentsRepository.create(appointment);
      }),
    );

    const dayAvailability = await listProviderDayAvailabilityService.execute({
      day: 10,
      month: 5,
      year: 2020,
      provider_id: 'anything',
    });

    const expectedResultToContain = [
      {
        hour: 8,
        available: false,
      },
      {
        hour: 9,
        available: true,
      },
      {
        hour: 10,
        available: false,
      },
      {
        hour: 11,
        available: true,
      },
    ];

    console.log({ monthAvailabilty: dayAvailability, expectedResultToContain });

    expect(dayAvailability).toEqual(
      expect.arrayContaining(expectedResultToContain),
    );
  });
});
