import { AppError } from '../../../common/AppError';
import { HttpStatusCode } from '../../../common/HttpStatusCode';

export class DuplicatedDefaultGutterNameError extends AppError {
  constructor() {
    super(
      'Já existe uma sarjeta padrão com esse nome',
      HttpStatusCode.CONFLICT
    );
  }
}
