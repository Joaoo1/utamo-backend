import { IUUID } from '../../../libs/UUID/IUUID';
import { ICreateCalculationDTO } from '../dtos/ICreateCalculationDTO';
import { BasinsWithoutAreaError } from '../errors/BasinsWithoutAreaError';
import { BasinsWithoutRunoffError } from '../errors/BasinsWithoutRunoffError';
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
    shouldSave,
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

    const hasAnyBasinsWithoutArea = basins.some((b) => !b.area);
    if (hasAnyBasinsWithoutArea) {
      throw new BasinsWithoutAreaError();
    }

    const hasAnyBasinsWithoutRunOff = basins.some((b) => !b.runoff);
    if (hasAnyBasinsWithoutRunOff) {
      throw new BasinsWithoutRunoffError();
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

    const calculation = {
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
      basinsIds,
    };

    if (shouldSave) {
      return this.calculationsRepository.create({
        id: this.uuid.generate(),
        ...calculation,
      });
    }

    return calculation;
  }
}
