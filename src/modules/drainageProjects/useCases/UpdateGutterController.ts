import { Request, Response } from 'express';
import { GuttersRepository } from '../repositories/GuttersRepository';
import { UpdateGutterUseCase } from './UpdateGutterUseCase';

class UpdateGutterController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { base, maxHeight, maxSpeed, roughness, slope, name } = request.body;

    const updateDrainageProjectUseCase = new UpdateGutterUseCase(
      new GuttersRepository()
    );

    await updateDrainageProjectUseCase.execute({
      id: request.params.gutterId,
      base,
      maxHeight,
      maxSpeed,
      roughness,
      slope,
      name,
      userCompanyId: request.user.companyId,
    });

    return response.status(200).json({});
  }
}

export { UpdateGutterController };
