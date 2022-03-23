import { sign } from 'jsonwebtoken';

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export const generateToken = ({ id, name, email, isAdmin }: User) => {
  return sign(
    {
      id,
      name,
      email,
      isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};
