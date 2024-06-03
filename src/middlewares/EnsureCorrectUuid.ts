import type { Request, Response, NextFunction } from 'express';

import { HttpStatusCode } from '../common/HttpStatusCode';
import { AppError } from '../common/AppError';
import { UUID } from '../libs/UUID';

const uuid = new UUID();

class InvalidIdError extends AppError {
  constructor() {
    super('Invalid ID', HttpStatusCode.BAD_REQUEST);
  }
}

export const EnsureCorrectUuid = async (
  request: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    for (const id in request.params) {
      const isValidUuid = uuid.validate(request.params[id]);

      if (!isValidUuid) {
        throw new InvalidIdError();
      }
    }

    return next();
  } catch (err) {
    throw new InvalidIdError();
  }
};
