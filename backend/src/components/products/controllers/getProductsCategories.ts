import { Request, Response } from 'express';
import { prisma } from '../../../services/prismabd';

export async function GetProductsCategories(req: Request, res: Response) {
  const categories = await prisma.product.findMany({
    distinct: ['category'],
    select: {
      category: true,
    },
  });

  res.send(categories);
}
