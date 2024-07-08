import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { BasinNotExistsError } from '../errors/BasinNotExistsError';
import { CalculationsRepository } from '../repositories/CalculationsRepository';
import { BasinsRepository } from '../repositories/BasinsRepository';
import { IUpdateBasinsRunoffDTO } from '../dtos/IUpdateBasinsRunoffDTO';

export class UpdateBasinsRunoffUseCase {
  constructor(
    private readonly basinsRepository: BasinsRepository,
    private readonly calculationsRepository: CalculationsRepository
  ) {}

  async execute({
    basinIdToCopy,
    userCompanyId,
    basinsToUpdate,
  }: IUpdateBasinsRunoffDTO) {
    const basin = await this.basinsRepository.findById(basinIdToCopy);

    if (!basin) {
      throw new BasinNotExistsError();
    }

    if (basin.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    await this.basinsRepository.updateByIds(basinsToUpdate, {
      runoff: basin.runoff,
    });

    const calculations =
      await this.calculationsRepository.findAllByDrainageProject(
        basin.drainageProjectId
      );

    if (calculations.length > 0) {
      await Promise.all(
        calculations.map((c) => this.calculationsRepository.recalculate(c.id))
      );
    }
  }
}
