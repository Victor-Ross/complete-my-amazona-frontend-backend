import { Request, Response } from 'express';
import { prisma } from '../../../services/prismabd';

type Query = {
  pageSize: string;
  page: string;
  category: string;
  brand: string;
  price: string;
  rating: string;
  order: string;
  searchQuery: string;
  query: string;
};

async function getProductsWithFilters(req: Request, res: Response) {
  const query = req.query as unknown as Query;

  const defaultPageSize = 3;

  const pageSize = Number(query.pageSize) || defaultPageSize;
  const page = Number(query.page) || 1;
  const category = query.category || '';
  const brand = query.brand || '';
  const price = query.price || 'all';
  const rating = query.rating || 'all';
  const order = query.order || '';
  const searchQuery = query.query || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          startsWith: searchQuery,
          mode: 'insensitive' as any,
        }
      : {};

  const categoryFilter = category && category !== 'all' ? category : {};

  const priceFilter =
    price && price !== 'all'
      ? {
          min: Number(price.split('-')[0]),
          max: Number(price.split('-')[1]),
        }
      : {
          min: 0,
          max: 999999,
        };

  const ratingFilter =
    rating && rating !== 'all'
      ? {
          min: Number(rating),
        }
      : { min: 0 };

  const sortOrder: any =
    order === 'toprated'
      ? { rating: 'desc' }
      : order === 'lowest'
      ? { price: 'asc' }
      : order === 'highest'
      ? { price: 'desc' }
      : order === 'newest'
      ? { created_at: 'desc' }
      : { id: 'asc' };

  let skip = 0;
  let exists = true;

  let filteredProducts = [];
  res.locals.msg = filteredProducts;

  while (exists) {
    filteredProducts = await prisma.product.findMany({
      where: {
        name: queryFilter,
        category: categoryFilter,
        price: {
          gte: priceFilter.min,
          lte: priceFilter.max,
        },
        rating: {
          gte: ratingFilter.min,
        },
      },
      orderBy: sortOrder,
      skip: skip,
      take: 3,
    });

    skip += 3;

    if (filteredProducts.length <= 0) {
      exists = false;
    } else {
      res.locals.msg.push(filteredProducts);
    }
  }

  if (res.locals.msg[0]) {
    const products = res.locals.msg[0];
    const count = res.locals.msg[0].length;

    res.send({
      products,
      count,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } else {
    res.status(404).send({ message: 'No product found' });
  }
}

export { getProductsWithFilters };
