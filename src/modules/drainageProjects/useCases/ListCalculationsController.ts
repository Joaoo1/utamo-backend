import { Request, Response } from 'express';
import { CalculationsRepository } from '../repositories/CalculationsRepository';
import { ListCalculationsUseCase } from './ListCalculationsUseCase';

class ListCalculationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const calculationsRepository = new CalculationsRepository();

    const listCalculationsUseCase = new ListCalculationsUseCase(
      calculationsRepository
    );
    const calculations = await listCalculationsUseCase.execute({
      drainageProjectId: request.params.id,
    });

    return response.status(200).json(calculations);
  }
}

export { ListCalculationsController };
