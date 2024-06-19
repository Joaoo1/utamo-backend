import { Request, Response } from 'express';
import { CreateCalculationUseCase } from './CreateCalculationUseCase';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { UUID } from '../../../libs/UUID';
import { GuttersRepository } from '../repositories/GuttersRepository';
import { DrainagesRepository } from '../repositories/DrainagesRepository';
import { BasinsRepository } from '../repositories/BasinsRepository';
import { CalculationsRepository } from '../repositories/CalculationsRepository';

class CalculateController {
  async handle(request: Request, response: Response): Promise<Response> {
    const createCalculationUseCase = new CreateCalculationUseCase(
      new CalculationsRepository(),
      new DrainageProjectsRepository(),
      new GuttersRepository(),
      new DrainagesRepository(),
      new BasinsRepository(),
      new UUID()
    );

    const calculation = await createCalculationUseCase.execute({
      basinsIds: request.body.basinsIds,
      gutterId: request.body.gutterId,
      drainageId: request.body.drainageId,
      drainageProjectId: request.params.id,
      startStationInt: request.body.startStationInt,
      startStationDecimal: request.body.startStationDecimal,
      endStationInt: request.body.endStationInt,
      endStationDecimal: request.body.endStationDecimal,
      rainIntensity: request.body.rainIntensity,
      concentrationTime: request.body.concentrationTime,
      userCompanyId: request.user.companyId,
      shouldSave: false,
    });

    return response.status(200).json(calculation);
  }
}

export { CalculateController };
