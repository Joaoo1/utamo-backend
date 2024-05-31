import { IDeleteGutterDTO } from '../dtos/IDeleteGutterDTO';
import { DrainageNotExists } from '../errors/DrainageNotExists';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompany';
import { DrainagesRepository } from '../repositories/DrainagesRepository';

export class DeleteDrainageUseCase {
  constructor(private readonly drainagesRepository: DrainagesRepository) {}

  async execute({ id, userCompanyId }: IDeleteGutterDTO) {
    const drainage = await this.drainagesRepository.findById(id);

    if (!drainage) {
      throw new DrainageNotExists();
    }

    if (drainage.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    await this.drainagesRepository.delete(id);
  }
}
