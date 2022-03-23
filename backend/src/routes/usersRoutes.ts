import { Router } from 'express';
import expressAsyncHandler = require('express-async-handler');

import { signIn } from '../components/users/controllers/signIn';
import { signUp } from '../components/users/controllers/signUp';
import { updateUser } from '../components/users/controllers/updateUser';
import { isAuth } from '../middlewares/isAuth';

const usersRouter = Router();

usersRouter.post('/signin', expressAsyncHandler(signIn));
usersRouter.post('/signup', expressAsyncHandler(signUp));
usersRouter.put('/profile', isAuth, expressAsyncHandler(updateUser));

export { usersRouter };
