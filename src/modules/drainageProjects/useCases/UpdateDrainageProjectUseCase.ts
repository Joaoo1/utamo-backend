import { UpdateDrainageProjectDTO } from '../dtos/IUpdateDrainageProjectDTO';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { DrainageProjectNotExistsError } from '../errors/DrainageProjectNotExistsError';
import { DuplicatedDrainageProjectNameError } from '../errors/DuplicatedDrainageProjectNameError';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';

export class UpdateDrainageProjectUseCase {
  constructor(
    private readonly drainageProjectRepository: DrainageProjectsRepository
  ) {}

  async execute({
    userCompanyId,
    defaultConcentrationTime,
    defaultRainIntensity,
    name,
    id,
  }: UpdateDrainageProjectDTO) {
    const project = await this.drainageProjectRepository.findById(id);

    if (!project) {
      throw new DrainageProjectNotExistsError();
    }

    if (project.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    if (name && name !== project.name) {
      const alreadyExists = await this.drainageProjectRepository.findByName(
        name,
        userCompanyId,
        id
      );

      if (alreadyExists) {
        throw new DuplicatedDrainageProjectNameError();
      }
    }

    await this.drainageProjectRepository.update(id, {
      defaultConcentrationTime,
      defaultRainIntensity,
      name,
      updatedAt: new Date(),
    });
  }
}
