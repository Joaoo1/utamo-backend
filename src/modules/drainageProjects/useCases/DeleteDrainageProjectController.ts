import { Request, Response } from 'express';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { DeleteDrainageProjectUseCase } from './DeleteDrainageProjectUseCase';

class DeleteDrainageProjectController {
  async handle(request: Request, response: Response): Promise<Response> {
    const deleteDrainageProjectUseCase = new DeleteDrainageProjectUseCase(
      new DrainageProjectsRepository()
    );

    await deleteDrainageProjectUseCase.execute({
      id: request.params.id,
      userCompanyId: request.user.companyId,
    });

    return response.status(200).json({});
  }
}

export { DeleteDrainageProjectController };
