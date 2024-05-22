import { IUUID } from '../../../libs/UUID/IUUID';
import { ICreateDrainageProjectDTO } from '../dtos/CreateDrainageProjectDTO';
import { DuplicatedDrainageProjectNameError } from '../errors/DuplicatedDrainageProjectName';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';

export class CreateDrainageProjectUseCase {
  constructor(
    private readonly drainageProjectRepository: DrainageProjectsRepository,
    private readonly uuid: IUUID
  ) {}

  async execute({
    companyId,
    createdBy,
    defaultConcentrationTime,
    defaultRainIntensity,
    name,
  }: ICreateDrainageProjectDTO) {
    const alreadyExists = await this.drainageProjectRepository.findByName(name);

    if (alreadyExists) {
      throw new DuplicatedDrainageProjectNameError();
    }

    await this.drainageProjectRepository.create({
      companyId,
      createdBy,
      defaultConcentrationTime,
      defaultRainIntensity,
      name,
      id: this.uuid.v4(),
    });
  }
}
