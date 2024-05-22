import { IHasher } from '../../../libs/Hasher/IHasher';
import { IJwt } from '../../../libs/Jwt/IJwt';
import { IAuthenticateUserDTO } from '../dtos/AuthenticateUserDTO';
import { CompanyNotActiveError } from '../errors/CompanyNotActive';
import { InvalidCredentialsError } from '../errors/InvalidCredentials';
import { UsersRepository } from '../repositories/UsersRepository';

export class AuthenticateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hasher: IHasher,
    private readonly jwt: IJwt
  ) {}

  async execute({ email, password }: IAuthenticateUserDTO) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValidPassword = await this.hasher.compare(
      password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }

    if (!user.company.active) {
      throw new CompanyNotActiveError();
    }

    const token = await this.jwt.encrypt({ id: user.id });

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }
}
