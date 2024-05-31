import { AppError } from '../../../common/AppError';
import { HttpStatusCode } from '../../../common/HttpStatusCode';

export class DrainageProjectNotExistsError extends AppError {
  constructor() {
    super('Projeto não encontrado', HttpStatusCode.NOT_FOUND);
  }
}
