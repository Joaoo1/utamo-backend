import { Request, Response } from 'express';
import { AuthenticateUserUseCase } from './AuthenticateUseCase';
import { UsersRepository } from '../repositories/UsersRepository';
import { Bcrypt } from '../../../libs/Hasher';
import { Jwt } from '../../../libs/Jwt';

class AuthenticateController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const authenticateUseCase = new AuthenticateUserUseCase(
      new UsersRepository(),
      new Bcrypt(8),
      new Jwt(process.env.JWT_SECRET ?? '')
    );

    const token = await authenticateUseCase.execute({
      email,
      password,
    });

    return response.status(200).json(token);
  }
}

export { AuthenticateController };
