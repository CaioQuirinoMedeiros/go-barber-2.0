import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list day availability from provider', async () => {
    const provider_id = 'any_provider_id';

    const appointmentsToCreate = [
      {
        date: new Date(2020, 4, 10, 9, 0, 0),
        provider_id,
        user_id: 'any_user_id',
      },
      {
        date: new Date(2020, 4, 10, 13, 0, 0),
        provider_id,
        user_id: 'any_user_id',
      },
    ];

    await Promise.all(
      appointmentsToCreate.map(async appointment => {
        await fakeAppointmentsRepository.create(appointment);
      }),
    );

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 11, 30).getTime();
    });

    const dayAvailability = await listProviderDayAvailabilityService.execute({
      day: 10,
      month: 5,
      year: 2020,
      provider_id,
    });

    const expectedResultToContain = [
      {
        hour: 8,
        available: false,
      },
      {
        hour: 9,
        available: false,
      },
      {
        hour: 10,
        available: false,
      },
      {
        hour: 11,
        available: false,
      },
      {
        hour: 12,
        available: true,
      },
      {
        hour: 13,
        available: false,
      },
      {
        hour: 14,
        available: true,
      },
    ];

    expect(dayAvailability).toEqual(
      expect.arrayContaining(expectedResultToContain),
    );
  });
});
