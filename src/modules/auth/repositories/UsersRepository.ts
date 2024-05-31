import { db } from '../../../database';

const defaultSelectFields = [
  'users.id',
  'users.name',
  'users.email',
  'users.passwordHash',
  'users.createdAt',
  'companies.id as company.id',
  'companies.name as company.name',
  'companies.active as company.active',
] as const;

export class UsersRepository {
  async findByEmail(email: string) {
    const user = await db
      .selectFrom('users')
      .where('email', '=', email)
      .innerJoin('companies', 'users.companyId', 'companies.id')
      .select(defaultSelectFields)
      .limit(1)
      .executeTakeFirst();

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      companyId: user['company.id'],
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      company: {
        id: user['company.id'],
        name: user['company.name'],
        active: user['company.active'],
      },
    };
  }

  async findById(id: string) {
    const user = await db
      .selectFrom('users')
      .where('users.id', '=', id)
      .innerJoin('companies', 'users.companyId', 'companies.id')
      .select(defaultSelectFields)
      .limit(1)
      .executeTakeFirst();

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      companyId: user['company.id'],
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      company: {
        id: user['company.id'],
        name: user['company.name'],
        active: user['company.active'],
      },
    };
  }
}
