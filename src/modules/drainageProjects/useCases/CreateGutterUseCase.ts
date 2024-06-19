import { GutterType } from '../../../database/types';
import { IUUID } from '../../../libs/UUID/IUUID';
import { ICreateGutterDTO } from '../dtos/ICreateGutterDTO';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { DrainageProjectNotExistsError } from '../errors/DrainageProjectNotExistsError';
import { DuplicatedGutterNameError } from '../errors/DuplicatedGutterNameError';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { GuttersRepository } from '../repositories/GuttersRepository';

export class CreateGutterUseCase {
  constructor(
    private readonly guttersRepository: GuttersRepository,
    private readonly drainageProjectsRepository: DrainageProjectsRepository,
    private readonly uuid: IUUID
  ) {}

  async execute({
    base,
    drainageProjectId,
    maxHeight,
    maxSpeed,
    roughness,
    slope,
    name,
    userCompanyId,
  }: ICreateGutterDTO) {
    const alreadyExists = await this.guttersRepository.findByName(
      name,
      drainageProjectId
    );

    if (alreadyExists) {
      throw new DuplicatedGutterNameError();
    }

    const drainageProject = await this.drainageProjectsRepository.findById(
      drainageProjectId
    );

    if (!drainageProject) {
      throw new DrainageProjectNotExistsError();
    }

    if (drainageProject.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    return this.guttersRepository.create({
      base,
      drainageProjectId,
      maxHeight,
      maxSpeed,
      roughness,
      slope,
      name,
      type: GutterType.Trapezoidal,
      id: this.uuid.generate(),
    });
  }
}
