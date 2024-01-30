import dotenv from "dotenv";
import { NODE_ENV } from "./config";

const envFile = NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile});

import { DataSource } from "typeorm";
import { dataSourceConfig } from "./config/datasource-config";

export const dataSource = new DataSource(dataSourceConfig);