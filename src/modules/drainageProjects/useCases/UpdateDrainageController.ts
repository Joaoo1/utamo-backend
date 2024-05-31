import { Request, Response } from 'express';
import { UpdateDrainageUseCase } from './UpdateDrainageUseCase';
import { DrainagesRepository } from '../repositories/DrainagesRepository';
import { DrainageSectionsRepository } from '../repositories/DrainageSectionsRepository';
import { CalculationsRepository } from '../repositories/CalculationsRepository';
import { UUID } from '../../../libs/UUID';

class UpdateDrainageController {
  async handle(request: Request, response: Response): Promise<Response> {
    const updateDrainageUseCase = new UpdateDrainageUseCase(
      new DrainagesRepository(),
      new DrainageSectionsRepository(),
      new CalculationsRepository(),
      new UUID()
    );

    await updateDrainageUseCase.execute({
      sections: request.body.sections,
      userCompanyId: request.user.companyId,
      id: request.params.drainageId,
    });

    return response.status(200).json({});
  }
}

export { UpdateDrainageController };
