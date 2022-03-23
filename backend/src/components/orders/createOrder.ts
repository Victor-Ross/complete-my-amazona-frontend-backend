import { Response } from 'express';
import { prisma } from '../../services/prismabd';
import { IGetUserAuthInfoRequest } from '../../index';

type Item = {
  id: string;
  name: string;
  slug: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  quantity: number;
};

export async function createOrder(req: IGetUserAuthInfoRequest, res: Response) {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  try {
    const order = await prisma.order.create({
      data: {
        order_products: {
          createMany: {
            data: orderItems.map((item: Item) => {
              return {
                fk_product_id: item.id,
                slug: item.slug,
                name: item.name,
                quantity: item.quantity,
                image: item.image,
                price: item.price,
              };
            }),
          },
        },
        shipping_address: {
          create: {
            address: shippingAddress.address,
            country: shippingAddress.country,
            city: shippingAddress.city,
            fullName: shippingAddress.fullName,
            postalCode: shippingAddress.postalCode,
          },
        },
        payment_method: paymentMethod,
        items_price: itemsPrice,
        shipping_price: shippingPrice,
        tax_price: taxPrice,
        total_price: totalPrice,
        paid_at: new Date(),
        delivered_at: new Date(),
        user: {
          connect: {
            id: req.user.id,
          },
        },
        payment_results: {
          create: {
            email_address: 'teste@gmail',
            status: 'enviado',
            updated_time: 'hoje',
          },
        },
      },
    });

    res.status(201).send({ message: 'New Order Created!', order });
  } catch (err) {
    console.log(err);
  }
}
