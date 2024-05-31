import { AppError } from '../../../common/AppError';
import { HttpStatusCode } from '../../../common/HttpStatusCode';

export class DrainageNotExistsError extends AppError {
  constructor() {
    super('Drenagem não encontrada', HttpStatusCode.NOT_FOUND);
  }
}
