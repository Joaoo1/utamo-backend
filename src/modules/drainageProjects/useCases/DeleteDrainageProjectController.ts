import { Request, Response } from 'express';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { DeleteDrainageProjectUseCase } from './DeleteDrainageProjectUseCase';
import { CalculationsRepository } from '../repositories/CalculationsRepository';

class DeleteDrainageProjectController {
  async handle(request: Request, response: Response): Promise<Response> {
    const deleteDrainageProjectUseCase = new DeleteDrainageProjectUseCase(
      new DrainageProjectsRepository(),
      new CalculationsRepository()
    );

    await deleteDrainageProjectUseCase.execute({
      id: request.params.id,
      userCompanyId: request.user.companyId,
    });

    return response.status(200).json({});
  }
}

export { DeleteDrainageProjectController };
