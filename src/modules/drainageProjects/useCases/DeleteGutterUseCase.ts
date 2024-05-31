import { IDeleteGutterDTO } from '../dtos/IDeleteGutterDTO';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { GutterNotExistsError } from '../errors/GutterNotExistsError';
import { GuttersRepository } from '../repositories/GuttersRepository';

export class DeleteGutterUseCase {
  constructor(private readonly guttersRepository: GuttersRepository) {}

  async execute({ id, userCompanyId }: IDeleteGutterDTO) {
    const gutter = await this.guttersRepository.findById(id);

    if (!gutter) {
      throw new GutterNotExistsError();
    }

    if (gutter.drainageProject.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    await this.guttersRepository.delete(id);
  }
}
