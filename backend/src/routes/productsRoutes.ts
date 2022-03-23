import * as express from 'express';
import { getProductBySlug } from '../components/products/controllers/getProductBySlug';

import { getProducts } from '../components/products/controllers/getProducts';
import { getProductsById } from '../components/products/controllers/getProductsById';

const productsRouter = express.Router();

productsRouter.get('/', getProducts);
productsRouter.get('/slug/:slug', getProductBySlug);
productsRouter.get('/:id', getProductsById);

export { productsRouter };
