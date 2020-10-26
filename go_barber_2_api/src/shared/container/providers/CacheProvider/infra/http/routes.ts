import { Router } from 'express';

import AppointmentsCacheController from '@shared/container/providers/CacheProvider/infra/controllers/AppointmentsCacheController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsCacheController = new AppointmentsCacheController();

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);
appointmentsRouter.delete('/appointments', appointmentsCacheController.destroy);

export default appointmentsRouter;
