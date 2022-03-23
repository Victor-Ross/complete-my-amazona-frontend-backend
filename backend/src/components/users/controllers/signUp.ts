import { Request, Response } from 'express';
import { hashSync } from 'bcryptjs';
import { prisma } from '../../../services/prismabd';
import { generateToken } from '../../../utils/generateToken';

export async function signUp(request: Request, response: Response) {
  const { name, email, password } = request.body;

  const newUser = {
    name,
    email,
    password: hashSync(password),
  };

  try {
    const user = await prisma.user.create({
      data: newUser,
    });

    response.send({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  } catch (error) {
    console.log(error);
  }

  return;
}
