import { Request, Response } from 'express';
import { UpdateCalculationUseCase } from './UpdateCalculationUseCase';
import { CalculationsRepository } from '../repositories/CalculationsRepository';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { GuttersRepository } from '../repositories/GuttersRepository';
import { DrainagesRepository } from '../repositories/DrainagesRepository';
import { BasinsRepository } from '../repositories/BasinsRepository';

class UpdateCalculationUseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const updateCalculationUseCase = new UpdateCalculationUseCase(
      new CalculationsRepository(),
      new DrainageProjectsRepository(),
      new GuttersRepository(),
      new DrainagesRepository(),
      new BasinsRepository()
    );

    await updateCalculationUseCase.execute({
      basinsIds: request.body.basinsIds,
      gutterId: request.body.gutterId,
      drainageProjectId: request.params.id,
      startStationInt: request.body.startStationInt,
      startStationDecimal: request.body.startStationDecimal,
      endStationInt: request.body.endStationInt,
      endStationDecimal: request.body.endStationDecimal,
      rainIntensity: request.body.rainIntensity,
      concentrationTime: request.body.concentrationTime,
      userCompanyId: request.user.companyId,
      id: request.params.calculationId,
    });

    return response.status(200).json({});
  }
}

export { UpdateCalculationUseController };
