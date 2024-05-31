import { AppError } from '../../../common/AppError';
import { HttpStatusCode } from '../../../common/HttpStatusCode';

export class GutterNotExistsError extends AppError {
  constructor() {
    super('Sarjeta não encontrada', HttpStatusCode.NOT_FOUND);
  }
}
