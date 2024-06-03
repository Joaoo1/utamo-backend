import { Request, Response } from 'express';
import { BasinsRepository } from '../repositories/BasinsRepository';
import { DeleteBasinUseCase } from './DeleteBasinUseCase';

class DeleteBasinController {
  async handle(request: Request, response: Response): Promise<Response> {
    const deleteBasinUseCase = new DeleteBasinUseCase(new BasinsRepository());

    await deleteBasinUseCase.execute({
      id: request.params.basinId,
      userCompanyId: request.user.companyId,
    });

    return response.status(200).json({});
  }
}

export { DeleteBasinController };
