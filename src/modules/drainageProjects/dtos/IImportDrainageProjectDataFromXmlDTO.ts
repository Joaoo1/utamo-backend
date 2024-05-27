import { BaseEntity } from '../../../common/BaseEntity';
import { DrainageSection } from '../entities/DrainageSection';
import { Line } from '../entities/Line';

type ImportLine = Omit<Line, keyof BaseEntity | 'basinId' | 'drainageId'>;

export interface IImportDrainageProjectDataFromXmlDTO {
  drainages: {
    name: string;
    length: number;
    lines: ImportLine[];
    sections: Omit<DrainageSection, keyof BaseEntity | 'drainageId'>[];
  }[];
  basins: {
    name: string;
    area: number;
    runoff: number;
    lines: ImportLine[];
  }[];
  userCompanyId: string;
  drainageProjectId: string;
}
