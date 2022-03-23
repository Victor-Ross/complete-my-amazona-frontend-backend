import * as express from 'express';
import expressAsyncHandler = require('express-async-handler');

import { createOrder } from '../components/orders/createOrder';
import { getOrderById } from '../components/orders/getOrderById';
import { changeOrderIsPaid } from '../components/orders/changeOrderIsPaid';
import { getOrdersByUser } from '../components/orders/getOrdersByUser';

import { isAuth } from '../middlewares/isAuth';

const ordersRouter = express.Router();

ordersRouter.post('/', isAuth, expressAsyncHandler(createOrder));
ordersRouter.get('/mine', isAuth, getOrdersByUser);
ordersRouter.get('/:id', isAuth, getOrderById);
ordersRouter.put('/:id/pay', isAuth, expressAsyncHandler(changeOrderIsPaid));

export { ordersRouter };
