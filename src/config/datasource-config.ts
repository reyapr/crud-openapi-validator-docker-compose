import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { PG_DB, PG_HOST, PG_PASSWORD, PG_PORT, PG_USER } from "./database";
import { NODE_ENV } from ".";

const entities = NODE_ENV === 'production' ? ['dist/src/entities/**/*.entity.js'] : ['src/entities/**/*.entity.ts'];

export const dataSourceConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: PG_HOST,
  port: PG_PORT,
  username: PG_USER,
  password: PG_PASSWORD,
  database: PG_DB,
  entities,
  migrations: ['src/migrations/*.ts']
}