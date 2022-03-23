import { Request, Response } from 'express';
import { prisma } from '../../../services/prismabd';

export async function getProductBySlug(request: Request, response: Response) {
  const { slug } = request.params;

  const product = await prisma.product.findFirst({
    where: { slug },
  });

  if (product) {
    return response.send(product);
  } else {
    return response.status(404).send({ message: 'Product Not Found' });
  }
}
