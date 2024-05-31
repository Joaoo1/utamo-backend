import { IDeleteGutterDTO } from '../dtos/IDeleteGutterDTO';
import { DrainageNotExistsError } from '../errors/DrainageNotExistsError';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { DrainagesRepository } from '../repositories/DrainagesRepository';

export class DeleteDrainageUseCase {
  constructor(private readonly drainagesRepository: DrainagesRepository) {}

  async execute({ id, userCompanyId }: IDeleteGutterDTO) {
    const drainage = await this.drainagesRepository.findById(id);

    if (!drainage) {
      throw new DrainageNotExistsError();
    }

    if (drainage.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    await this.drainagesRepository.delete(id);
  }
}
