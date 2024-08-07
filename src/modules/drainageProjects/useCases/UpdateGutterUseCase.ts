import { IUpdateGutterDTO } from '../dtos/IUpdateGutterDTO';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { DuplicatedGutterNameError } from '../errors/DuplicatedGutterNameError';
import { GutterNotExistsError } from '../errors/GutterNotExistsError';
import { CalculationsRepository } from '../repositories/CalculationsRepository';
import { GuttersRepository } from '../repositories/GuttersRepository';

export class UpdateGutterUseCase {
  constructor(
    private readonly guttersRepository: GuttersRepository,
    private readonly calculationsRepository: CalculationsRepository
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

    const updatedGutter = await this.guttersRepository.update(id, {
      base,
      maxHeight,
      maxSpeed,
      roughness,
      slope,
      name,
      color,
    });

    const calculations =
      await this.calculationsRepository.findAllCalculationsByGutterId(
        gutter.id
      );

    if (calculations.length > 0) {
      await Promise.all(
        calculations.map((c) => this.calculationsRepository.recalculate(c.id))
      );
    }

    return updatedGutter;
  }
}
