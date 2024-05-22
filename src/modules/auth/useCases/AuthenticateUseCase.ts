import { IHasher } from '../../../libs/Hasher/IHasher';
import { IJwt } from '../../../libs/Jwt/IJwt';
import { IAuthenticateUserRequestDTO } from '../dtos/AuthenticateUserRequestDTO';
import { CompanyNotActive } from '../errors/CompanyNotActive';
import { InvalidCredentials } from '../errors/InvalidCredentials';
import { UsersRepository } from '../repositories/UsersRepository';

export class AuthenticateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hasher: IHasher,
    private readonly jwt: IJwt
  ) {}

  async execute({ email, password }: IAuthenticateUserRequestDTO) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentials();
    }

    const isValidPassword = await this.hasher.compare(
      password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new InvalidCredentials();
    }

    if (!user.company.active) {
      throw new CompanyNotActive();
    }

    const token = await this.jwt.encrypt({ id: user.id });

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }
}
