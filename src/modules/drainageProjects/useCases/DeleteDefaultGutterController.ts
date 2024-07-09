import { Request, Response } from 'express';
import { DefaultGuttersRepository } from '../repositories/DefaultGuttersRepository';
import { DeleteDefaultGutterUseCase } from './DeleteDefaultGutterUseCase';

class DeleteDefaultGutterController {
  async handle(request: Request, response: Response): Promise<Response> {
    const deleteGutterUseCase = new DeleteDefaultGutterUseCase(
      new DefaultGuttersRepository()
    );

    await deleteGutterUseCase.execute({
      id: request.params.defaultGutterId,
      userCompanyId: request.user.companyId,
    });

    return response.status(200).json({});
  }
}

export { DeleteDefaultGutterController };
