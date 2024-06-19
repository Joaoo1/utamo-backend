import { AppError } from '../../../common/AppError';
import { HttpStatusCode } from '../../../common/HttpStatusCode';

export class BasinsWithoutRunoffError extends AppError {
  constructor() {
    super('Existem bacias sem runoff', HttpStatusCode.BAD_REQUEST);
  }
}
