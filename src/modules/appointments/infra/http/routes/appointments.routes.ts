import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '@modules/appointments/infra/controllers/AppointmentsController';

const appointmentsController = new AppointmentsController();

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (req, res) => {
//   const appointments = await appointmentsRepository.find();

//   return res.send(appointments);
// });

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
