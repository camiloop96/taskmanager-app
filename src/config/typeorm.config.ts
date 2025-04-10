import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import "dotenv/config";

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: POSTGRES_HOST || "localhost",
  port: Number(POSTGRES_PORT) || 5432,
  username: POSTGRES_USER || "taskuser",
  password: POSTGRES_PASSWORD || "task123",
  database: POSTGRES_DB || "task_db",
  autoLoadEntities: true,
  synchronize: true,
  logging: false,
  logger: "advanced-console",
  migrationsRun: false,
  migrations: ["dist/**/migrations/*.js"],
  entities: ["dist/**/models/*.js"],
};
