import { BaseEntity } from '../../../common/BaseEntity';
import { DrainageSection } from '../entities/DrainageSection';

export interface IUpdateDrainageDTO {
  sections: Omit<DrainageSection, keyof BaseEntity | 'drainageId'>[];
  userCompanyId: string;
  id: string;
}
