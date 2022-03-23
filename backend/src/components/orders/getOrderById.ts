import { Request, Response } from 'express';
import { prisma } from '../../services/prismabd';

export async function getOrderById(req: Request, response: Response) {
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: {
      id,
    },
    include: {
      shipping_address: true,
      order_products: {
        include: {
          product: true,
        },
      },
    },
  });

  if (order) {
    response.send(order);
  } else {
    response.status(404).send({ message: 'Order Not Found' });
  }
}
