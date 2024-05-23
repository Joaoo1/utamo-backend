import { Request, Response } from 'express';
import { UpdateDrainageProjectUseCase } from './UpdateDrainageProjectUseCase';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';

class UpdateDrainageProjectController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, defaultConcentrationTime, defaultRainIntensity } =
      request.body;
    const updateDrainageProjectUseCase = new UpdateDrainageProjectUseCase(
      new DrainageProjectsRepository()
    );

    await updateDrainageProjectUseCase.execute({
      name,
      defaultConcentrationTime,
      defaultRainIntensity,
      userCompanyId: request.user.companyId,
      id: request.params.id,
    });

    return response.status(200).json({});
  }
}

export { UpdateDrainageProjectController };
