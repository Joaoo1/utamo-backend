import { AppError } from '../../../common/AppError';
import { HttpStatusCode } from '../../../common/HttpStatusCode';

export class DuplicatedDrainageProjectNameError extends AppError {
  constructor() {
    super('Já existe um projeto com esse nome', HttpStatusCode.CONFLICT);
  }
}
