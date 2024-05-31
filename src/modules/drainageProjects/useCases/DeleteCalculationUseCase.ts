import { IDeleteCalculationDTO } from '../dtos/IDeleteCalculationDTO';
import { CalculationNotExists } from '../errors/CalculationNotExistsError';
import { DrainageProjectDontBelongsToUserCompanyError } from '../errors/DrainageProjectDontBelongsToUserCompanyError';
import { CalculationsRepository } from '../repositories/CalculationsRepository';

export class DeleteCalculationUseCase {
  constructor(
    private readonly calculationsRepository: CalculationsRepository
  ) {}

  async execute({ id, userCompanyId }: IDeleteCalculationDTO) {
    const calculation = await this.calculationsRepository.findById(id);

    if (!calculation) {
      throw new CalculationNotExists();
    }

    if (calculation.companyId !== userCompanyId) {
      throw new DrainageProjectDontBelongsToUserCompanyError();
    }

    await this.calculationsRepository.delete(id);
  }
}
