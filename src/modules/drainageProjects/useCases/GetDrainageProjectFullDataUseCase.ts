import { IGetDrainageProjectFullDataDTO } from '../dtos/IGetDrainageProjectFullDataDTO';
import { DrainageProjectNotExistsError } from '../errors/DrainageProjectNotExistsError';
import { DrainageProjectsRepository } from '../repositories/DrainageProjectsRepository';

export class GetDrainageProjectFullDataUseCase {
  constructor(
    private readonly drainageProjectRepository: DrainageProjectsRepository
  ) {}

  async execute({ id, userCompanyId }: IGetDrainageProjectFullDataDTO) {
    const data = await this.drainageProjectRepository.findByIdFullData(
      id,
      userCompanyId
    );

    if (!data) {
      throw new DrainageProjectNotExistsError();
    }

    return data;
  }
}
