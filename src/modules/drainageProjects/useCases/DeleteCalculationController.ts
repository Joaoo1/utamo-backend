import { Request, Response } from 'express';
import { CalculationsRepository } from '../repositories/CalculationsRepository';
import { DeleteCalculationUseCase } from './DeleteCalculationUseCase';

class DeleteCalculationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const deleteDrainageProjectUseCase = new DeleteCalculationUseCase(
      new CalculationsRepository()
    );

    await deleteDrainageProjectUseCase.execute({
      id: request.params.calculationId,
      userCompanyId: request.user.companyId,
    });

    return response.status(200).json({});
  }
}

export { DeleteCalculationController };
