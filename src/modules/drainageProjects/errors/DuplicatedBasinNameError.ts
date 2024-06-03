import { AppError } from '../../../common/AppError';
import { HttpStatusCode } from '../../../common/HttpStatusCode';

export class DuplicatedBasinNameError extends AppError {
  constructor() {
    super(
      'Já existe uma bacia com esse nome nesse projeto',
      HttpStatusCode.CONFLICT
    );
  }
}
