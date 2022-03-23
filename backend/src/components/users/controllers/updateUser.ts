import { Request, Response } from 'express';
import { hashSync } from 'bcryptjs';
import { prisma } from '../../../services/prismabd';
import { generateToken } from '../../../utils/generateToken';
import { IGetUserAuthInfoRequest } from '../../../index';

type User = {
  name: string;
  email: string;
  password: string;
};

async function updateUser(req: IGetUserAuthInfoRequest, res: Response) {
  const { name, email, password }: User = req.body;

  const user = await prisma.user.findFirst({
    where: {
      id: req.user.id,
    },
  });

  if (user) {
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        name: name || user.name,
        email: email || user.email,
        password: password ? hashSync(password, 8) : password,
      },
    });

    res.send({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
}

export { updateUser };
