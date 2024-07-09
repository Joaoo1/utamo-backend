import { Request, Response } from 'express';
import { DefaultGuttersRepository } from '../repositories/DefaultGuttersRepository';
import { ListDefaultGuttersUseCase } from './ListDefaultGuttersUseCase';

class ListDefaultGuttersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const defaultGuttersRepository = new DefaultGuttersRepository();

    const listDefaultGuttersUseCase = new ListDefaultGuttersUseCase(
      defaultGuttersRepository
    );
    const defaultGutters = await listDefaultGuttersUseCase.execute({
      companyId: request.user.companyId,
    });

    return response.status(200).json(defaultGutters);
  }
}

export { ListDefaultGuttersController };
