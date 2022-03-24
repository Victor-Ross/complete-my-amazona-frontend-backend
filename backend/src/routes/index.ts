import express = require('express');
import path = require('path');
import { productsRouter } from './productsRoutes';
import { usersRouter } from './usersRoutes';
import { seedRouter } from './seedRoutes';
import { ordersRouter } from './ordersRoutes';
import { paypalRouter } from './paymentsRoutes/paypalRoutes';

const routes = express.Router();

routes.use('/api', paypalRouter);
routes.use('/api/products', productsRouter);
routes.use('/api/users', usersRouter);
routes.use('/api/seed', seedRouter);
routes.use('/api/orders', ordersRouter);

const __dirname = path.resolve();

routes.use(express.static(path.join(__dirname, '/frontend/dist')));

routes.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

export { routes };
