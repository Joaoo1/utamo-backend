import { DrainageProjectNotExistsError } from '../errors/DrainageProjectNotExistsError';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { IDeleteDrainageProjectDTO } from '../dtos/IDeleteDrainageProjectDTO';
import { CalculationsRepository } from '../repositories/CalculationsRepository';

export class DeleteDrainageProjectUseCase {
  constructor(
    private readonly drainageProjectRepository: DrainageProjectsRepository,
    private readonly calculationsRepository: CalculationsRepository
  ) {}

  async execute({ userCompanyId, id }: IDeleteDrainageProjectDTO) {
    const project = await this.drainageProjectRepository.findById(id);

    if (!project) {
      throw new DrainageProjectNotExistsError();
    }

    if (project.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    await this.calculationsRepository.deleteByDrainageProjectId(id);

    await this.drainageProjectRepository.delete(id);
  }
}
