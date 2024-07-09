import { IUUID } from '../../../libs/UUID/IUUID';
import { ICreateDrainageProjectDTO } from '../dtos/ICreateDrainageProjectDTO';
import { DuplicatedDrainageProjectNameError } from '../errors/DuplicatedDrainageProjectNameError';
import { DefaultGuttersRepository } from '../repositories/DefaultGuttersRepository';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { GuttersRepository } from '../repositories/GuttersRepository';

export class CreateDrainageProjectUseCase {
  constructor(
    private readonly drainageProjectRepository: DrainageProjectsRepository,
    private readonly guttersRepository: GuttersRepository,
    private readonly defaultGuttersRepository: DefaultGuttersRepository,
    private readonly uuid: IUUID
  ) {}

  async execute({
    userCompanyId,
    createdBy,
    defaultConcentrationTime,
    defaultRainIntensity,
    name,
  }: ICreateDrainageProjectDTO) {
    const alreadyExists = await this.drainageProjectRepository.findByName(
      name,
      userCompanyId
    );

    if (alreadyExists) {
      throw new DuplicatedDrainageProjectNameError();
    }

    const drainageProject = await this.drainageProjectRepository.create({
      companyId: userCompanyId,
      createdBy,
      defaultConcentrationTime,
      defaultRainIntensity,
      name,
      id: this.uuid.generate(),
    });

    await this.createDefaultGutters(drainageProject.id, userCompanyId);

    return drainageProject;
  }

  private async createDefaultGutters(
    drainageProjectId: string,
    userCompanyId: string
  ) {
    const defaultGutters = await this.defaultGuttersRepository.listByCompanyId(
      userCompanyId
    );

    for (const gutter of defaultGutters) {
      await this.guttersRepository.create({
        base: gutter.base,
        color: gutter.color,
        maxHeight: gutter.maxHeight,
        maxSpeed: gutter.maxSpeed,
        roughness: gutter.roughness,
        slope: gutter.slope,
        name: gutter.name,
        type: gutter.type,
        drainageProjectId,
        id: this.uuid.generate(),
      });
    }
  }
}
