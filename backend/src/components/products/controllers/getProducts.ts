import { Request, Response } from 'express';
import { prisma } from '../../../services/prismabd';

export async function getProducts(request: Request, response: Response) {
  const products = await prisma.product.findMany({});
  return response.send(products);
}
