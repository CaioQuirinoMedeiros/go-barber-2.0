import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it("should be able to list the provider's appointments on specif day", async () => {
    const appointmentsToCreate = [
      {
        date: new Date(2020, 4, 10, 8, 0, 0),
        provider_id: 'provider_id',
        user_id: 'anything',
      },
      {
        date: new Date(2020, 4, 10, 9, 0, 0),
        provider_id: 'provider_id',
        user_id: 'anything',
      },
      {
        date: new Date(2020, 4, 12, 10, 0, 0),
        provider_id: 'provider_id',
        user_id: 'anything',
      },
    ];

    const [appointment1, appointment2] = await Promise.all(
      appointmentsToCreate.map(async appointment => {
        return fakeAppointmentsRepository.create(appointment);
      }),
    );

    const monthAvailabilty = await listProviderAppointmentsService.execute({
      day: 10,
      month: 5,
      year: 2020,
      provider_id: 'provider_id',
    });

    expect(monthAvailabilty).toEqual([appointment1, appointment2]);
  });
});
