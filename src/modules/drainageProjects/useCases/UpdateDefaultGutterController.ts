import { Request, Response } from 'express';
import { DefaultGuttersRepository } from '../repositories/DefaultGuttersRepository';
import { UpdateDefaultGutterUseCase } from './UpdateDefaultGutterUseCase';

class UpdateDefaultGutterController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { base, maxHeight, maxSpeed, roughness, slope, name, color } =
      request.body;

    const updateDefaultGutterUseCase = new UpdateDefaultGutterUseCase(
      new DefaultGuttersRepository()
    );

    const gutter = await updateDefaultGutterUseCase.execute({
      id: request.params.defaultGutterId,
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

export { UpdateDefaultGutterController };
