import { Request, Response, NextFunction } from 'express';

import { AppError } from '../common/AppError';

export const ErrorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).send({ message: error.message });
  }

  return res.status(500).send({ message: 'Something went wrong' });
};
