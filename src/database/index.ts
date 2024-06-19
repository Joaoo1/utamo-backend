import 'dotenv/config';
import { Pool } from 'pg';
import { Kysely, PostgresDialect, sql } from 'kysely';
import { AuthTypes, Connector } from '@google-cloud/cloud-sql-connector';

import { Database as DatabaseTypes } from './types';

function convertSqlNumericFieldsToNumber() {
  const types = require('pg').types;
  types.setTypeParser(types.builtins.NUMERIC, (val: any) => parseFloat(val));
}

convertSqlNumericFieldsToNumber();

export class Database {
  private static db: Kysely<DatabaseTypes>;

  public static async init() {
    Database.db = await Database.createDbInstance();
  }

  public static getInstance() {
    if (!Database.db) {
      throw new Error('Database not initialized!');
    }

    return Database.db;
  }

  private static async createDbInstance() {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      return Database.getProdInstance();
    }

    return Database.getDevInstance();
  }

  private static async getProdInstance() {
    const connector = new Connector();
    const clientOpts = await connector.getOptions({
      instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME || '',
      authType: AuthTypes.IAM,
    });

    const dialect = new PostgresDialect({
      pool: new Pool({
        ...clientOpts,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
      }),
    });

    return new Kysely<DatabaseTypes>({
      dialect,
      log: ['query'],
    });
  }

  private static async getDevInstance() {
    const dialect = new PostgresDialect({
      pool: new Pool({
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: Number(process.env.DB_PORT ?? 5432),
        max: 10,
      }),
    });

    return new Kysely<DatabaseTypes>({
      dialect,
    });
  }
}
