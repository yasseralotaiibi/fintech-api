import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const jwtValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ message: 'Authorization header is required' });
    return;
  }

  const token = header.replace('Bearer ', '').trim();

  try {
    const decoded = jwt.verify(token, env.jwtIssuerSigningKey, {
      algorithms: ['HS256'],
    });

    (req as Request & { user?: unknown }).user = decoded;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: 'Invalid or expired access token', details: (error as Error).message });
  }
};
