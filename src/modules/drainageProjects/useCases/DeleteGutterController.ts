import { Request, Response } from 'express';
import { GuttersRepository } from '../repositories/GuttersRepository';
import { DeleteGutterUseCase } from './DeleteGutterUseCase';

class DeleteGutterController {
  async handle(request: Request, response: Response): Promise<Response> {
    const deleteGutterUseCase = new DeleteGutterUseCase(
      new GuttersRepository()
    );

    await deleteGutterUseCase.execute({
      id: request.params.gutterId,
      userCompanyId: request.user.companyId,
    });

    return response.status(200).json({});
  }
}

export { DeleteGutterController };
