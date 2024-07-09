import { BaseEntity } from '../../../common/BaseEntity';
import { GutterType } from '../../../database/types';
import { IUUID } from '../../../libs/UUID/IUUID';
import { IImportDrainageProjectDataFromXmlDTO } from '../dtos/IImportDrainageProjectDataFromXmlDTO';
import { DrainageSection } from '../entities/DrainageSection';
import { Gutter } from '../entities/Gutter';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { DrainageProjectNotExistsError } from '../errors/DrainageProjectNotExistsError';
import { BasinsRepository } from '../repositories/BasinsRepository';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { DrainageSectionsRepository } from '../repositories/DrainageSectionsRepository';
import { DrainagesRepository } from '../repositories/DrainagesRepository';
import { GuttersRepository } from '../repositories/GuttersRepository';
import { LinesRepository } from '../repositories/LinesRepository';

export class ImportDrainageProjectDataFromXmlUseCase {
  constructor(
    private readonly drainageProjectRepository: DrainageProjectsRepository,
    private readonly drainagesRepository: DrainagesRepository,
    private readonly basinsRepository: BasinsRepository,
    private readonly drainageSectionsRepository: DrainageSectionsRepository,
    private readonly linesRepository: LinesRepository,
    private readonly guttersRepository: GuttersRepository,
    private readonly uuid: IUUID
  ) {}

  async execute({
    drainages,
    basins,
    userCompanyId,
    drainageProjectId,
  }: IImportDrainageProjectDataFromXmlDTO) {
    const drainageProject = await this.drainageProjectRepository.findById(
      drainageProjectId
    );

    if (!drainageProject) {
      throw new DrainageProjectNotExistsError();
    }

    if (drainageProject.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    await this.handleImportDrainages({ drainages, drainageProjectId });
    await this.handleImportBasins({ basins, drainageProjectId });
  }

  private async handleImportDrainages({
    drainages,
    drainageProjectId,
  }: Pick<
    IImportDrainageProjectDataFromXmlDTO,
    'drainages' | 'drainageProjectId'
  >) {
    const existentDrainages = await this.drainagesRepository.findAllByNames(
      drainages.map((d) => d.name),
      drainageProjectId
    );

    interface CreatedDrainage
      extends Pick<(typeof drainages)[0], 'lines' | 'sections'> {
      id: string;
    }

    const createdDrainages = await drainages.reduce(async (acc, d) => {
      const data = await acc;

      const alreadyExists = existentDrainages.find((e) => e.name === d.name);

      if (alreadyExists) {
        await this.drainagesRepository.update(alreadyExists.id, {
          name: d.name,
          length: d.length,
          updatedAt: new Date(),
        });

        data.push({
          id: alreadyExists.id,
          lines: d.lines,
          sections: d.sections,
        });
        return data;
      }

      const createdDrainage = {
        id: this.uuid.generate(),
        length: d.length,
        name: d.name,
        drainageProjectId,
      };

      await this.drainagesRepository.create(createdDrainage);

      data.push({
        id: createdDrainage.id,
        lines: d.lines,
        sections: d.sections,
      });
      return data;
    }, Promise.resolve([] as CreatedDrainage[]));

    const linesPromise = createdDrainages.map(async (drainage) => {
      await this.linesRepository.deleteAllFromDrainage(drainage.id);

      const newLines = drainage.lines.map((l) => ({
        ...l,
        drainageId: drainage.id,
        id: this.uuid.generate(),
      }));

      await this.linesRepository.createAll(newLines);
    });

    const sectionsPromise = createdDrainages.map(async (drainage) => {
      await this.drainageSectionsRepository.deleteAllFromDrainage(drainage.id);

      const newSections = drainage.sections.map((section) => ({
        ...section,
        id: this.uuid.generate(),
        drainageId: drainage.id,
      }));

      await this.drainageSectionsRepository.createAll(newSections);
    });

    await Promise.all([...linesPromise, ...sectionsPromise]);
  }

  private async handleImportBasins({
    basins,
    drainageProjectId,
  }: Pick<
    IImportDrainageProjectDataFromXmlDTO,
    'basins' | 'drainageProjectId'
  >) {
    const existentBasins = await this.basinsRepository.findAllByNames(
      basins.map((d) => d.name),
      drainageProjectId
    );

    const createdBasins = await Promise.all(
      basins.map(async (b) => {
        const alreadyExists = existentBasins.find((e) => e.name === b.name);

        if (alreadyExists) {
          await this.basinsRepository.update(alreadyExists.id, {
            name: b.name,
            area: b.area,
            runoff: b.runoff,
            updatedAt: new Date(),
          });

          return { id: alreadyExists.id, lines: b.lines };
        }

        const newBasin = {
          id: this.uuid.generate(),
          area: b.area,
          name: b.name,
          runoff: b.runoff,
          drainageProjectId,
        };

        await this.basinsRepository.create(newBasin);

        return { id: newBasin.id, lines: b.lines };
      })
    );

    const linesPromise = createdBasins.map(async (basin) => {
      await this.linesRepository.deleteAllFromBasin(basin.id);

      const newLines = basin.lines.map((l) => ({
        ...l,
        basinId: basin.id,
        id: this.uuid.generate(),
      }));

      await this.linesRepository.createAll(newLines);
    });

    await Promise.all(linesPromise);
  }
}
