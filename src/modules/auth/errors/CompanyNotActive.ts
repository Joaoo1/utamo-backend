import { AppError } from '../../../common/AppError';
import { HttpStatusCode } from '../../../common/HttpStatusCode';

export class CompanyNotActive extends AppError {
  constructor() {
    super(
      'Sua empresa não está habilitada para utilizar o app',
      HttpStatusCode.PAYMENT_REQUIRED
    );
  }
}
