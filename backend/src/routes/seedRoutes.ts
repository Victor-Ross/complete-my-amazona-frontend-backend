import { Router } from 'express';
import { prisma } from '../services/prismabd';
import { data } from '../../data';

const seedRouter = Router();

seedRouter.get('/', async (req, res) => {
  // Seed Products
  await prisma.product.deleteMany({});
  await prisma.product.createMany({
    data: data.products,
  });
  const createdProducts = await prisma.product.findMany({});

  // Seed Users
  await prisma.user.deleteMany({});
  await prisma.user.createMany({
    data: data.users,
  });
  const createdUsers = await prisma.user.findMany({});

  res.send({ createdProducts, createdUsers });
});

export { seedRouter };
