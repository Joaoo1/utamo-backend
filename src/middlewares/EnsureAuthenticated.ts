import type { Request, Response, NextFunction } from 'express';

import { HttpStatusCode } from '../common/HttpStatusCode';
import { Jwt } from '../libs/Jwt';
import { UsersRepository } from '../modules/auth/repositories/UsersRepository';
import { AppError } from '../common/AppError';

const userRepository = new UsersRepository();
const jwt = new Jwt(process.env.JWT_SECRET ?? '');

class InvalidTokenError extends AppError {
  constructor() {
    super('Invalid token', HttpStatusCode.UNAUTHORIZED);
  }
}

class MissingTokenError extends AppError {
  constructor() {
    super('Missing required token', HttpStatusCode.UNAUTHORIZED);
  }
}

export const EnsureAuthenticated = async (
  request: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  const token = request.headers.authorization?.split(' ').at(-1);

  if (!token) {
    throw new MissingTokenError();
  }

  const isNotJwtToken = !jwt.validate(token);

  if (isNotJwtToken) {
    throw new InvalidTokenError();
  }

  try {
    const { id } = jwt.decrypt(token);

    const user = await userRepository.findById(id);

    if (!user) {
      throw new InvalidTokenError();
    }

    request.user = { companyId: user.companyId, id: user.id };

    return next();
  } catch (err) {
    throw new InvalidTokenError();
  }
};
