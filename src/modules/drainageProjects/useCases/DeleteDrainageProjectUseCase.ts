import { DrainageProjectNotExistsError } from '../errors/DrainageProjectNotExists';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompany';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { IDeleteDrainageProjectDTO } from '../dtos/IDeleteDrainageProjectDTO';

export class DeleteDrainageProjectUseCase {
  constructor(
    private readonly drainageProjectRepository: DrainageProjectsRepository
  ) {}

  async execute({ userCompanyId, id }: IDeleteDrainageProjectDTO) {
    const project = await this.drainageProjectRepository.findById(id);

    if (!project) {
      throw new DrainageProjectNotExistsError();
    }

    if (project.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    await this.drainageProjectRepository.delete(id);
  }
}
