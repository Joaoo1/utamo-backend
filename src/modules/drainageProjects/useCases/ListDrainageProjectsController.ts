import { Request, Response } from 'express';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { ListDrainageProjectsUseCase } from './ListDrainageProjectUseCase';

class ListDrainageProjectsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const drainageProjectsRepository = new DrainageProjectsRepository();

    const listDrainagesProjectUseCase = new ListDrainageProjectsUseCase(
      drainageProjectsRepository
    );
    const drainageProjects = await listDrainagesProjectUseCase.execute({
      companyId: request.user.companyId,
    });

    return response.status(200).json({ drainageProjects });
  }
}

export { ListDrainageProjectsController };
