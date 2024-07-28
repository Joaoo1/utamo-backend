import { IUpdateCalculationDTO } from '../dtos/IUpdateCalculationDTO';
import { CalculationDataError } from '../errors/CalculationDataError';
import { CalculationNotExistsError } from '../errors/CalculationNotExistsError';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { DrainageProjectNotExistsError } from '../errors/DrainageProjectNotExistsError';
import { BasinsRepository } from '../repositories/BasinsRepository';
import { CalculationsRepository } from '../repositories/CalculationsRepository';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { DrainagesRepository } from '../repositories/DrainagesRepository';
import { GuttersRepository } from '../repositories/GuttersRepository';
import { calculate } from '../utils/calculate';

export class UpdateCalculationUseCase {
  constructor(
    private readonly calculationsRepository: CalculationsRepository,
    private readonly drainageProjectsRepository: DrainageProjectsRepository,
    private readonly guttersRepository: GuttersRepository,
    private readonly drainagesRepository: DrainagesRepository,
    private readonly basinsRepository: BasinsRepository
  ) {}

  async execute({
    id,
    basinsIds,
    concentrationTime,
    endStationDecimal,
    endStationInt,
    gutterId,
    rainIntensity,
    startStationDecimal,
    startStationInt,
    drainageProjectId,
    userCompanyId,
  }: IUpdateCalculationDTO) {
    const calculation = await this.calculationsRepository.findById(id);

    if (!calculation) {
      throw new CalculationNotExistsError();
    }

    const drainageProject = await this.drainageProjectsRepository.findById(
      drainageProjectId
    );

    if (!drainageProject) {
      throw new DrainageProjectNotExistsError();
    }

    if (calculation.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    const gutterPromise = this.guttersRepository.findById(gutterId);
    const drainagePromise = this.drainagesRepository.findByIdWithSections(
      calculation.drainageId
    );
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

    await this.calculationsRepository.update(id, {
      ...calculationResult,
      startStationInt,
      startStationDecimal,
      endStationInt,
      endStationDecimal,
      concentrationTime,
      rainIntensity,
      basinsIds,
      gutterId,
    });
  }
}
