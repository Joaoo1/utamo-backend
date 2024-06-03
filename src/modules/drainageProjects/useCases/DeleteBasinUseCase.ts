import { IDeleteBasinDTO } from '../dtos/IDeleteBasinDTO';
import { BasinNotExistsError } from '../errors/BasinNotExistsError';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { BasinsRepository } from '../repositories/BasinsRepository';

export class DeleteBasinUseCase {
  constructor(private readonly basinsRepository: BasinsRepository) {}

  async execute({ id, userCompanyId }: IDeleteBasinDTO) {
    const basin = await this.basinsRepository.findById(id);

    if (!basin) {
      throw new BasinNotExistsError();
    }

    if (basin.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    await this.basinsRepository.delete(id);
  }
}
