import express = require('express');
import { verify } from 'jsonwebtoken';
import { IGetUserAuthInfoRequest } from '../index';

export const isAuth = (
  req: IGetUserAuthInfoRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.slice(7, authorization.length);

    verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode as any;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};
