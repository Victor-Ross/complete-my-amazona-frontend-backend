import { Request, Response } from 'express';
import { compareSync } from 'bcryptjs';

import { prisma } from '../../../services/prismabd';
import { generateToken } from '../../../utils/generateToken';

export async function signIn(request: Request, response: Response) {
  const { email, password } = request.body;

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (user) {
    if (compareSync(password, user.password)) {
      response.send({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    }
  }
  response.status(401).send({ message: 'Invalid email or password' });
}
