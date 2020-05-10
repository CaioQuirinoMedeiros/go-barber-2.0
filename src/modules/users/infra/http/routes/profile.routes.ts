import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProfileController from '@modules/users/infra/controllers/ProfileController';

const profileController = new ProfileController();

const profileRouter = Router();

profileRouter.use(ensureAuthenticated);
profileRouter.put('/', profileController.update);
profileRouter.get('/', profileController.show);

export default profileRouter;
