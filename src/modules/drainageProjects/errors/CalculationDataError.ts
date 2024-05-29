import { AppError } from '../../../common/AppError';
import { HttpStatusCode } from '../../../common/HttpStatusCode';

export class CalculationDataError extends AppError {
  constructor() {
    super('Dados do cálculos com problema', HttpStatusCode.NOT_FOUND);
  }
}
