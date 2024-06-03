import { AppError } from '../../../common/AppError';
import { HttpStatusCode } from '../../../common/HttpStatusCode';

export class BasinNotExistsError extends AppError {
  constructor() {
    super('Bacia não encontrada', HttpStatusCode.NOT_FOUND);
  }
}
