import { Request, Response } from 'express';
import { prisma } from '../../services/prismabd';

export async function changeOrderIsPaid(req: Request, res: Response) {
  const { id: orderId } = req.params;
  const {
    id: paymentResultsId,
    status,
    updated_time,
    email_address,
  } = req.body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        is_paid: true,
        paid_at: new Date(Date.now()),
        payment_results: {
          update: {
            id: paymentResultsId,
            status,
            updated_time,
            email_address,
          },
        },
      },
    });

    res.send({ message: 'Order Paid', order: updatedOrder });
  } catch (error) {
    res.status(404).send({ message: 'Order Not Found' });
  }
}
