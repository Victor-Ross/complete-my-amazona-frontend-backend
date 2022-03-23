import { Request, Response } from 'express';
import { prisma } from '../../services/prismabd';
import { IGetUserAuthInfoRequest } from '../..';

export async function getOrdersByUser(
  req: IGetUserAuthInfoRequest,
  res: Response
) {
  const orders = await prisma.order.findMany({
    where: {
      fk_user_id: req.user.id,
    },
  });

  res.send(orders);
}
