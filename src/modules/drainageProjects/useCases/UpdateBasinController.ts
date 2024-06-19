import { Request, Response } from 'express';
import { BasinsRepository } from '../repositories/BasinsRepository';
import { UpdateBasinUseCase } from './UpdateBasinUseCase';
import { CalculationsRepository } from '../repositories/CalculationsRepository';

class UpdateBasinController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { area, runoff, name } = request.body;

    const updateBasinUseCase = new UpdateBasinUseCase(
      new BasinsRepository(),
      new CalculationsRepository()
    );

    const updatedBasin = await updateBasinUseCase.execute({
      area,
      runoff,
      name,
      id: request.params.basinId,
      userCompanyId: request.user.companyId,
    });

    return response.status(200).json(updatedBasin);
  }
}

export { UpdateBasinController };
