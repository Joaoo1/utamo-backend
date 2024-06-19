import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { BasinNotExistsError } from '../errors/BasinNotExistsError';
import { CalculationsRepository } from '../repositories/CalculationsRepository';
import { BasinsRepository } from '../repositories/BasinsRepository';
import { DuplicatedBasinNameError } from '../errors/DuplicatedBasinNameError';
import { IUpdateBasinDTO } from '../dtos/IUpdateBasinDTO';

export class UpdateBasinUseCase {
  constructor(
    private readonly basinsRepository: BasinsRepository,
    private readonly calculationsRepository: CalculationsRepository
  ) {}

  async execute({ area, name, runoff, id, userCompanyId }: IUpdateBasinDTO) {
    const basin = await this.basinsRepository.findById(id);

    if (!basin) {
      throw new BasinNotExistsError();
    }

    if (basin.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    if (name && name !== basin.name) {
      const alreadyExists = await this.basinsRepository.findByName(
        name,
        basin.drainageProjectId
      );

      if (alreadyExists) {
        throw new DuplicatedBasinNameError();
      }
    }

    const updatedBasin = await this.basinsRepository.update(id, {
      area,
      name,
      runoff,
      updatedAt: new Date(),
    });

    const calculations =
      await this.calculationsRepository.findAllCalculationsByBasinId(basin.id);

    if (calculations.length > 0) {
      await Promise.all(
        calculations.map((c) => this.calculationsRepository.recalculate(c.id))
      );
    }

    return updatedBasin;
  }
}
