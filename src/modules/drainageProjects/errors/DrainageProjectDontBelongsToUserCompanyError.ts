import { AppError } from '../../../common/AppError';
import { HttpStatusCode } from '../../../common/HttpStatusCode';

export class DrainageProjectDontBelongsToUserCompanyError extends AppError {
  constructor() {
    super('Projeto não pertence a sua empresa', HttpStatusCode.FORBIDDEN);
  }
}
