import { Router } from 'express';
import { productsRouter } from './productsRoutes';
import { usersRouter } from './usersRoutes';
import { seedRouter } from './seedRoutes';
import { ordersRouter } from './ordersRoutes';
import { paypalRouter } from './paymentsRoutes/paypalRoutes';

const routes = Router();

routes.use('/api', paypalRouter);
routes.use('/api/products', productsRouter);
routes.use('/api/users', usersRouter);
routes.use('/api/seed', seedRouter);
routes.use('/api/orders', ordersRouter);

export { routes };
