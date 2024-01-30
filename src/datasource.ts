import dotenv from "dotenv";
dotenv.config();

import { DataSource } from "typeorm";
import { dataSourceConfig } from "./config/datasource-config";

export const dataSource = new DataSource(dataSourceConfig);