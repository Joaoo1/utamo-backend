import { BaseEntity } from '../../../common/BaseEntity';

export interface Company extends BaseEntity {
  name: string;
  active: boolean;
}
