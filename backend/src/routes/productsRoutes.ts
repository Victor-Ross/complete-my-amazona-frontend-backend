import * as express from 'express';
import expressAsyncHandler = require('express-async-handler');

import { getProductBySlug } from '../components/products/controllers/getProductBySlug';
import { getProducts } from '../components/products/controllers/getProducts';
import { getProductsById } from '../components/products/controllers/getProductsById';
import { GetProductsCategories } from '../components/products/controllers/getProductsCategories';
import { getProductsWithFilters } from '../components/products/controllers/getProductsWithFilters';

const productsRouter = express.Router();

productsRouter.get('/', getProducts);
productsRouter.get('/search', expressAsyncHandler(getProductsWithFilters));
productsRouter.get('/categories', expressAsyncHandler(GetProductsCategories));
productsRouter.get('/slug/:slug', getProductBySlug);
productsRouter.get('/:id', getProductsById);

export { productsRouter };
