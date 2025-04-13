import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSourceOptions } from "typeorm";
import "dotenv/config";

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

const isCompiled = __filename.endsWith(".js");

export const typeOrmConfig: TypeOrmModuleOptions & DataSourceOptions = {
  type: "postgres",
  host: POSTGRES_HOST || "localhost",
  port: Number(POSTGRES_PORT) || 5432,
  username: POSTGRES_USER || "taskuser",
  password: POSTGRES_PASSWORD || "task123",
  database: POSTGRES_DB || "task_db",
  synchronize: true,
  autoLoadEntities: true,
  logging: true,
  logger: "advanced-console",
  migrationsRun: false,
  migrations: [
    isCompiled ? "dist/**/migrations/*.js" : "src/**/migrations/*.ts",
  ],
  entities: [
    isCompiled
      ? "dist/modules/**/infrastructure/persistence/models/*.model.js"
      : "src/modules/**/infrastructure/persistence/models/*.model.ts",
  ],
};
