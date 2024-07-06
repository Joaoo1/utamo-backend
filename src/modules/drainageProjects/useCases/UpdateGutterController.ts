import { Request, Response } from 'express';
import { GuttersRepository } from '../repositories/GuttersRepository';
import { UpdateGutterUseCase } from './UpdateGutterUseCase';
import { CalculationsRepository } from '../repositories/CalculationsRepository';

class UpdateGutterController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { base, maxHeight, maxSpeed, roughness, slope, name, color } =
      request.body;

    const updateGutterUseCase = new UpdateGutterUseCase(
      new GuttersRepository(),
      new CalculationsRepository()
    );

    const gutter = await updateGutterUseCase.execute({
      id: request.params.gutterId,
      base,
      maxHeight,
      maxSpeed,
      roughness,
      slope,
      name,
      color,
      userCompanyId: request.user.companyId,
    });

    return response.status(200).json(gutter);
  }
}

export { UpdateGutterController };
