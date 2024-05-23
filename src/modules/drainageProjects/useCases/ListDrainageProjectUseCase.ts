import { IListDrainageProjectsDTO } from '../dtos/IListDrainageProjectsDTO';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';

export class ListDrainageProjectsUseCase {
  constructor(
    private readonly drainageProjectRepository: DrainageProjectsRepository
  ) {}

  async execute({ companyId }: IListDrainageProjectsDTO) {
    return this.drainageProjectRepository.listByCompanyId(companyId);
  }
}
