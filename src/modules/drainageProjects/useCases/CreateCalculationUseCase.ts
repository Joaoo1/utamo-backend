import { IUUID } from '../../../libs/UUID/IUUID';
import { ICreateCalculationDTO } from '../dtos/ICreateCalculationDTO';
import { CalculationDataError } from '../errors/CalculationDataError';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { DrainageProjectNotExistsError } from '../errors/DrainageProjectNotExistsError';
import { BasinsRepository } from '../repositories/BasinsRepository';
import { CalculationsRepository } from '../repositories/CalculationsRepository';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { DrainagesRepository } from '../repositories/DrainagesRepository';
import { GuttersRepository } from '../repositories/GuttersRepository';
import { calculate } from '../utils/calculate';

export class CreateCalculationUseCase {
  constructor(
    private readonly calculationsRepository: CalculationsRepository,
    private readonly drainageProjectsRepository: DrainageProjectsRepository,
    private readonly guttersRepository: GuttersRepository,
    private readonly drainagesRepository: DrainagesRepository,
    private readonly basinsRepository: BasinsRepository,
    private readonly uuid: IUUID
  ) {}

  async execute({
    drainageProjectId,
    basinsIds,
    gutterId,
    drainageId,
    startStationInt,
    startStationDecimal,
    endStationInt,
    endStationDecimal,
    concentrationTime,
    rainIntensity,
    userCompanyId,
  }: ICreateCalculationDTO) {
    const drainageProject = await this.drainageProjectsRepository.findById(
      drainageProjectId
    );

    if (!drainageProject) {
      throw new DrainageProjectNotExistsError();
    }

    if (drainageProject.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    const gutterPromise = this.guttersRepository.findById(gutterId);
    const drainagePromise =
      this.drainagesRepository.findByIdWithSections(drainageId);
    const basinsPromise = this.basinsRepository.findAllByIds(
      basinsIds,
      drainageProjectId
    );

    const [gutter, drainage, basins] = await Promise.all([
      gutterPromise,
      drainagePromise,
      basinsPromise,
    ]);

    if (!gutter || !drainage || basins.length === 0) {
      throw new CalculationDataError();
    }

    const calculationResult = calculate({
      concentrationTime,
      rainIntensity,
      drainageSections: drainage.sections,
      basins: basins,
      gutter: gutter,
      startEnd: {
        start: {
          int: startStationInt,
          decimal: startStationDecimal,
        },
        end: {
          int: endStationInt,
          decimal: endStationDecimal,
        },
      },
    });

    await this.calculationsRepository.create({
      id: this.uuid.generate(),
      ...calculationResult,
      startStationInt,
      startStationDecimal,
      endStationInt,
      endStationDecimal,
      concentrationTime,
      rainIntensity,
      gutterId: gutterId,
      drainageId: drainageId,
      drainageProjectId,
    });
  }
}
