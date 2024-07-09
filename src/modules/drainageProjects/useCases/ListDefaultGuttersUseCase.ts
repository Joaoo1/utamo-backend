import { IListDefaultGuttersDTO } from '../dtos/IListDefaultGuttersDTO';
import { DefaultGuttersRepository } from '../repositories/DefaultGuttersRepository';

export class ListDefaultGuttersUseCase {
  constructor(
    private readonly defaultGuttersRepository: DefaultGuttersRepository
  ) {}

  async execute({ companyId }: IListDefaultGuttersDTO) {
    return this.defaultGuttersRepository.listByCompanyId(companyId);
  }
}
