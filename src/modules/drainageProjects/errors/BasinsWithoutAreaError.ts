import { AppError } from '../../../common/AppError';
import { HttpStatusCode } from '../../../common/HttpStatusCode';

export class BasinsWithoutAreaError extends AppError {
  constructor() {
    super('Existem bacias sem área', HttpStatusCode.BAD_REQUEST);
  }
}
