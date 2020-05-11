import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
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
        date: new Date(2020, 4, 10, 9, 0, 0),
        provider_id: 'anything',
      },
      {
        date: new Date(2020, 4, 10, 10, 0, 0),
        provider_id: 'anything',
      },
      {
        date: new Date(2020, 4, 10, 11, 0, 0),
        provider_id: 'anything',
      },
      {
        date: new Date(2020, 4, 10, 12, 0, 0),
        provider_id: 'anything',
      },
      {
        date: new Date(2020, 4, 10, 14, 0, 0),
        provider_id: 'anything',
      },
      {
        date: new Date(2020, 4, 10, 14, 0, 0),
        provider_id: 'anything',
      },
      {
        date: new Date(2020, 4, 10, 15, 0, 0),
        provider_id: 'anything',
      },
      {
        date: new Date(2020, 4, 10, 16, 0, 0),
        provider_id: 'anything',
      },
      {
        date: new Date(2020, 4, 10, 17, 0, 0),
        provider_id: 'anything',
      },
      {
        date: new Date(2020, 4, 12, 10, 0, 0),
        provider_id: 'anything',
      },
    ];

    await Promise.all(
      appointmentsToCreate.map(async appointment => {
        await fakeAppointmentsRepository.create(appointment);
      }),
    );

    const monthAvailabilty = await listProviderMonthAvailabilityService.execute(
      {
        month: 5,
        year: 2020,
        provider_id: 'anything',
      },
    );

    const expectedResultToContain = [
      {
        day: 9,
        available: true,
      },
      {
        day: 10,
        available: false,
      },
      {
        day: 11,
        available: true,
      },
      {
        day: 12,
        available: true,
      },
    ];

    expect(monthAvailabilty).toEqual(
      expect.arrayContaining(expectedResultToContain),
    );
  });
});
