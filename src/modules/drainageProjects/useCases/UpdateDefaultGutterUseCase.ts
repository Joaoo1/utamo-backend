import { IUpdateGutterDTO } from '../dtos/IUpdateGutterDTO';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { DuplicatedDefaultGutterNameError } from '../errors/DuplicatedDefaultGutterNameError';
import { GutterNotExistsError } from '../errors/GutterNotExistsError';
import { DefaultGuttersRepository } from '../repositories/DefaultGuttersRepository';

export class UpdateDefaultGutterUseCase {
  constructor(
    private readonly defaultGuttersRepository: DefaultGuttersRepository
  ) {}

  async execute({
    base,
    maxHeight,
    maxSpeed,
    roughness,
    slope,
    name,
    color,
    id,
    userCompanyId,
  }: IUpdateGutterDTO) {
    const gutter = await this.defaultGuttersRepository.findById(id);

    if (!gutter) {
      throw new GutterNotExistsError();
    }

    if (gutter.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    if (name && name !== gutter.name) {
      const alreadyExists = await this.defaultGuttersRepository.findByName(
        name,
        gutter.companyId
      );

      if (alreadyExists) {
        throw new DuplicatedDefaultGutterNameError();
      }
    }

    return this.defaultGuttersRepository.update(id, {
      base,
      maxHeight,
      maxSpeed,
      roughness,
      slope,
      name,
      color,
    });
  }
}
