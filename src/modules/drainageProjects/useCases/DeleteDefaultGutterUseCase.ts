import { IDeleteGutterDTO } from '../dtos/IDeleteGutterDTO';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { GutterNotExistsError } from '../errors/GutterNotExistsError';
import { DefaultGuttersRepository } from '../repositories/DefaultGuttersRepository';

export class DeleteDefaultGutterUseCase {
  constructor(
    private readonly defaultGuttersRepository: DefaultGuttersRepository
  ) {}

  async execute({ id, userCompanyId }: IDeleteGutterDTO) {
    const gutter = await this.defaultGuttersRepository.findById(id);

    if (!gutter) {
      throw new GutterNotExistsError();
    }

    if (gutter.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    await this.defaultGuttersRepository.delete(id);
  }
}
