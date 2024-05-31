import { AppError } from '../../../common/AppError';
import { HttpStatusCode } from '../../../common/HttpStatusCode';

export class CalculationNotExistsError extends AppError {
  constructor() {
    super('Cálculo não encontrado', HttpStatusCode.NOT_FOUND);
  }
}
