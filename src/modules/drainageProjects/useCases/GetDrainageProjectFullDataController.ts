import { Request, Response } from 'express';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { GetDrainageProjectFullDataUseCase } from './GetDrainageProjectFullDataUseCase';

class GetDrainageProjectFullDataController {
  async handle(request: Request, response: Response): Promise<Response> {
    const drainageProjectsRepository = new DrainageProjectsRepository();

    const getDrainageProjectFullData = new GetDrainageProjectFullDataUseCase(
      drainageProjectsRepository
    );
    const data = await getDrainageProjectFullData.execute({
      userCompanyId: request.user.companyId,
      id: request.params.id,
    });

    return response.status(200).json(data);
  }
}

export { GetDrainageProjectFullDataController };
