import { GutterType } from '../../../database/types';
import { IUUID } from '../../../libs/UUID/IUUID';
import { ICreateDefaultGutterDTO } from '../dtos/ICreateDefaultGutterDTO';
import { DuplicatedDefaultGutterNameError } from '../errors/DuplicatedDefaultGutterNameError';
import { DefaultGuttersRepository } from '../repositories/DefaultGuttersRepository';

export class CreateDefaultGutterUseCase {
  constructor(
    private readonly defaultGuttersRepository: DefaultGuttersRepository,
    private readonly uuid: IUUID
  ) {}

  async execute({
    base,
    maxHeight,
    maxSpeed,
    roughness,
    slope,
    name,
    color,
    userCompanyId,
  }: ICreateDefaultGutterDTO) {
    const alreadyExists = await this.defaultGuttersRepository.findByName(
      name,
      userCompanyId
    );

    if (alreadyExists) {
      throw new DuplicatedDefaultGutterNameError();
    }

    return this.defaultGuttersRepository.create({
      base,
      maxHeight,
      maxSpeed,
      roughness,
      slope,
      name,
      color,
      type: GutterType.Trapezoidal,
      id: this.uuid.generate(),
      companyId: userCompanyId,
    });
  }
}
