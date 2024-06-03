import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { DrainageNotExistsError } from '../errors/DrainageNotExistsError';
import { DrainagesRepository } from '../repositories/DrainagesRepository';
import { IUpdateDrainageDTO } from '../dtos/IUpdateDrainageDTO';
import { DrainageSectionsRepository } from '../repositories/DrainageSectionsRepository';
import { IUUID } from '../../../libs/UUID/IUUID';
import { CalculationsRepository } from '../repositories/CalculationsRepository';

export class UpdateDrainageUseCase {
  constructor(
    private readonly drainagesRepository: DrainagesRepository,
    private readonly drainageSectionsRepository: DrainageSectionsRepository,
    private readonly calculationsRepository: CalculationsRepository,
    private readonly uuid: IUUID
  ) {}

  async execute({ userCompanyId, sections, id }: IUpdateDrainageDTO) {
    const drainage = await this.drainagesRepository.findById(id);

    if (!drainage) {
      throw new DrainageNotExistsError();
    }

    if (drainage.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    await this.drainageSectionsRepository.deleteAllFromDrainage(drainage.id);

    const newSections = sections.map((section) => ({
      ...section,
      id: this.uuid.generate(),
      drainageId: drainage.id,
    }));

    await this.drainageSectionsRepository.createAll(newSections);

    const calculations =
      await this.calculationsRepository.findAllCalculationsByDrainageId(
        drainage.id
      );

    if (calculations.length > 0) {
      await Promise.all(
        calculations.map((c) => this.calculationsRepository.recalculate(c.id))
      );
    }
  }
}
