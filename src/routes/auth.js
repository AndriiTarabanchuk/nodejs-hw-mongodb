import { Router } from 'express';

import {
  loginUserValidSchema,
  registerUserValidSchema,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  registerUserController,
} from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserValidSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(loginUserValidSchema),
  ctrlWrapper(loginUserController),
);

// authRouter.post('/logout', ctrlWrapper(logoutUserController));

// authRouter.post('/refresh-session', ctrlWrapper(refreshUserSessionController));

export default authRouter;