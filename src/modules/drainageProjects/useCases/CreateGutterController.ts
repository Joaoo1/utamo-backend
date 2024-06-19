import { Request, Response } from 'express';
import { UUID } from '../../../libs/UUID';
import { CreateGutterUseCase } from './CreateGutterUseCase';
import { GuttersRepository } from '../repositories/GuttersRepository';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';

class CreateGutterController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { base, maxHeight, maxSpeed, roughness, slope, name } = request.body;

    const createDrainageProjectUseCase = new CreateGutterUseCase(
      new GuttersRepository(),
      new DrainageProjectsRepository(),
      new UUID()
    );

    const createdGutter = await createDrainageProjectUseCase.execute({
      base,
      maxHeight,
      maxSpeed,
      roughness,
      slope,
      name,
      drainageProjectId: request.params.id,
      userCompanyId: request.user.companyId,
    });

    return response.status(200).json(createdGutter);
  }
}

export { CreateGutterController };
