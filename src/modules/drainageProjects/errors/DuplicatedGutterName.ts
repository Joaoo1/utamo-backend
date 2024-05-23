import { AppError } from '../../../common/AppError';
import { HttpStatusCode } from '../../../common/HttpStatusCode';

export class DuplicatedGutterNameError extends AppError {
  constructor() {
    super(
      'Já existe uma sarjeta com esse nome nesse projeto',
      HttpStatusCode.CONFLICT
    );
  }
}
