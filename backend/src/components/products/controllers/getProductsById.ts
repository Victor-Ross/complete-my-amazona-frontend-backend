import { Request, Response } from 'express';
import { prisma } from '../../../services/prismabd';

export async function getProductsById(request: Request, response: Response) {
  const { id } = request.params;

  const product = await prisma.product.findFirst({
    where: { id },
  });

  if (product) {
    return response.send(product);
  } else {
    return response.status(404).send({ message: 'Product Not Found' });
  }
}
