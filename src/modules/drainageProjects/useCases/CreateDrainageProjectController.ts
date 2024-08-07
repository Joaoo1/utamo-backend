import { Request, Response } from 'express';
import { CreateDrainageProjectUseCase } from './CreateDrainageProjectUseCase';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { UUID } from '../../../libs/UUID';
import { GuttersRepository } from '../repositories/GuttersRepository';
import { DefaultGuttersRepository } from '../repositories/DefaultGuttersRepository';

class CreateDrainageProjectController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, defaultConcentrationTime, defaultRainIntensity } =
      request.body;
    const createDrainageProjectUseCase = new CreateDrainageProjectUseCase(
      new DrainageProjectsRepository(),
      new GuttersRepository(),
      new DefaultGuttersRepository(),
      new UUID()
    );

    const project = await createDrainageProjectUseCase.execute({
      name,
      defaultConcentrationTime,
      defaultRainIntensity,
      createdBy: request.user.id,
      userCompanyId: request.user.companyId,
    });

    return response.status(200).json(project);
  }
}

export { CreateDrainageProjectController };
