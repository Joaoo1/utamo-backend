import { IListCalculationsDTO } from '../dtos/IListCalculationsDTO';
import { CalculationsRepository } from '../repositories/CalculationsRepository';

export class ListCalculationsUseCase {
  constructor(
    private readonly drainageProjectRepository: CalculationsRepository
  ) {}

  async execute({ drainageProjectId }: IListCalculationsDTO) {
    return this.drainageProjectRepository.findAllByDrainageProjectWithFullData(
      drainageProjectId
    );
  }
}
