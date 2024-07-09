import { Request, Response } from 'express';
import { UUID } from '../../../libs/UUID';
import { CreateDefaultGutterUseCase } from './CreateDefaultGutterUseCase';
import { DefaultGuttersRepository } from '../repositories/DefaultGuttersRepository';

class CreateDefaultGutterController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { base, maxHeight, maxSpeed, roughness, slope, name, color } =
      request.body;

    const createDefaultDrainageProjectUseCase = new CreateDefaultGutterUseCase(
      new DefaultGuttersRepository(),
      new UUID()
    );

    const createdDefaultGutter =
      await createDefaultDrainageProjectUseCase.execute({
        base,
        maxHeight,
        maxSpeed,
        roughness,
        slope,
        name,
        color,
        userCompanyId: request.user.companyId,
      });

    return response.status(200).json(createdDefaultGutter);
  }
}

export { CreateDefaultGutterController };
