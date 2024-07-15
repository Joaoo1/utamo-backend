import { Request, Response } from 'express';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { ImportDrainageProjectDataFromXmlUseCase } from './ImportDrainageProjectDataFromXmlUseCase';
import { DrainagesRepository } from '../repositories/DrainagesRepository';
import { BasinsRepository } from '../repositories/BasinsRepository';
import { UUID } from '../../../libs/UUID';
import { DrainageSectionsRepository } from '../repositories/DrainageSectionsRepository';
import { LinesRepository } from '../repositories/LinesRepository';

class ImportDrainageProjectDataFromXmlController {
  async handle(request: Request, response: Response): Promise<Response> {
    const importProjectDataUseCase =
      new ImportDrainageProjectDataFromXmlUseCase(
        new DrainageProjectsRepository(),
        new DrainagesRepository(),
        new BasinsRepository(),
        new DrainageSectionsRepository(),
        new LinesRepository(),
        new UUID()
      );

    await importProjectDataUseCase.execute({
      basins: request.body.basins,
      drainages: request.body.drainages,
      baseX: request.body.baseX,
      baseY: request.body.baseY,
      drainageProjectId: request.params.id,
      userCompanyId: request.user.companyId,
    });

    return response.status(200).json({});
  }
}

export { ImportDrainageProjectDataFromXmlController };
