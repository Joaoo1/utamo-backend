import { IUpdateGutterDTO } from '../dtos/IUpdateGutterDTO';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompany';
import { DuplicatedGutterNameError } from '../errors/DuplicatedGutterName';
import { GutterNotExistsError } from '../errors/GutterNotExists';
import { GuttersRepository } from '../repositories/GuttersRepository';

export class UpdateGutterUseCase {
  constructor(private readonly guttersRepository: GuttersRepository) {}

  async execute({
    base,
    maxHeight,
    maxSpeed,
    roughness,
    slope,
    name,
    id,
    userCompanyId,
  }: IUpdateGutterDTO) {
    const gutter = await this.guttersRepository.findById(id);

    if (!gutter) {
      throw new GutterNotExistsError();
    }

    if (gutter.drainageProject!.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    if (name && name !== gutter.name) {
      const alreadyExists = await this.guttersRepository.findByName(
        name,
        gutter.drainageProjectId
      );

      if (alreadyExists) {
        throw new DuplicatedGutterNameError();
      }
    }

    await this.guttersRepository.update(id, {
      base,
      maxHeight,
      maxSpeed,
      roughness,
      slope,
      name,
    });
  }
}
