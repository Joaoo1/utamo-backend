import { Request, Response } from 'express';
import { GuttersRepository } from '../repositories/GuttersRepository';
import { UpdateGutterUseCase } from './UpdateGutterUseCase';
import { CalculationsRepository } from '../repositories/CalculationsRepository';

class UpdateGutterController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { base, maxHeight, maxSpeed, roughness, slope, name } = request.body;

    const updateGutterUseCase = new UpdateGutterUseCase(
      new GuttersRepository(),
      new CalculationsRepository()
    );

    await updateGutterUseCase.execute({
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
