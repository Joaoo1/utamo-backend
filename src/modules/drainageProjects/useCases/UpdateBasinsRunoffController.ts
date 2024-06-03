import { Request, Response } from 'express';
import { BasinsRepository } from '../repositories/BasinsRepository';
import { UpdateBasinsRunoffUseCase } from './UpdateBasinsRunoffUseCase';
import { CalculationsRepository } from '../repositories/CalculationsRepository';

class UpdateBasinRunoffController {
  async handle(request: Request, response: Response): Promise<Response> {
    const updateBasinUseCase = new UpdateBasinsRunoffUseCase(
      new BasinsRepository(),
      new CalculationsRepository()
    );

    await updateBasinUseCase.execute({
      id: request.params.basinId,
      userCompanyId: request.user.companyId,
    });

    return response.status(200).json({});
  }
}

export { UpdateBasinRunoffController };
