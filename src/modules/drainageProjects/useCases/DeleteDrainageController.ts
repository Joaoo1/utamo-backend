import { Request, Response } from 'express';
import { DeleteDrainageUseCase } from './DeleteDrainageUseCase';
import { DrainagesRepository } from '../repositories/DrainagesRepository';

class DeleteDrainageController {
  async handle(request: Request, response: Response): Promise<Response> {
    const deleteDrainageUseCase = new DeleteDrainageUseCase(
      new DrainagesRepository()
    );

    await deleteDrainageUseCase.execute({
      id: request.params.drainageId,
      userCompanyId: request.user.companyId,
    });

    return response.status(200).json({});
  }
}

export { DeleteDrainageController };
