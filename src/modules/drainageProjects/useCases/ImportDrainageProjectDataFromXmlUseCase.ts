import { IUUID } from '../../../libs/UUID/IUUID';
import { IImportDrainageProjectDataFromXmlDTO } from '../dtos/IImportDrainageProjectDataFromXmlDTO';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompany';
import { DrainageProjectNotExistsError } from '../errors/DrainageProjectNotExists';
import { BasinsRepository } from '../repositories/BasinsRepository';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';
import { DrainageSectionsRepository } from '../repositories/DrainageSectionsRepository';
import { DrainagesRepository } from '../repositories/DrainagesRepository';
import { LinesRepository } from '../repositories/LinesRepository';

export class ImportDrainageProjectDataFromXmlUseCase {
  constructor(
    private readonly drainageProjectRepository: DrainageProjectsRepository,
    private readonly drainagesRepository: DrainagesRepository,
    private readonly basinsRepository: BasinsRepository,
    private readonly drainageSectionsRepository: DrainageSectionsRepository,
    private readonly linesRepository: LinesRepository,
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
    const existentDrainages = await this.drainagesRepository.selectAllByName(
      drainages.map((d) => d.name),
      drainageProjectId
    );

    const createdDrainages = await Promise.all(
      drainages.map(async (d) => {
        const alreadyExists = existentDrainages.find((e) => e.name === d.name);

        if (alreadyExists) {
          await this.drainagesRepository.update(alreadyExists.id, {
            name: d.name,
            length: d.length,
            updatedAt: new Date(),
          });

          return { id: alreadyExists.id, lines: d.lines, sections: d.sections };
        }

        const createdDrainage = {
          id: this.uuid.v4(),
          length: d.length,
          name: d.name,
          drainageProjectId,
        };

        await this.drainagesRepository.create(createdDrainage);

        return { id: createdDrainage.id, lines: d.lines, sections: d.sections };
      })
    );

    const linesPromise = createdDrainages.map(async (drainage) => {
      await this.linesRepository.deleteAllFromDrainage(drainage.id);

      const newLines = drainage.lines.map((l) => ({
        ...l,
        drainageId: drainage.id,
        id: this.uuid.v4(),
      }));

      await this.linesRepository.createAll(newLines);
    });

    const sectionsPromise = createdDrainages.map(async (drainage) => {
      await this.drainageSectionsRepository.deleteAllFromDrainage(drainage.id);

      const newSections = drainage.sections.map((section) => ({
        ...section,
        id: this.uuid.v4(),
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
    const existentBasins = await this.basinsRepository.selectAllByName(
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
          id: this.uuid.v4(),
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
        id: this.uuid.v4(),
      }));

      await this.linesRepository.createAll(newLines);
    });

    await Promise.all(linesPromise);
  }
}
