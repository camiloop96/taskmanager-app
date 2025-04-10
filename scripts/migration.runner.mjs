// scripts/migration.runner.mjs
import path from "path";
import { fileURLToPath } from "url";
import { DataSource } from "typeorm";
import datasourceConfig from "../src/database/datasource.ts";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [moduleName, migrationName] = process.argv.slice(2);

if (!moduleName || !migrationName) {
  console.error(
    "\x1b[31m%s\x1b[0m",
    "Error: Parámetros requeridos\n\nUso: npm run migration:run-specific -- <module-name> <migration-name>\n"
  );
  process.exit(1);
}

const main = async () => {
  const migrationPath = path.join(
    __dirname,
    "..",
    "src",
    moduleName.toLowerCase(),
    "infrastructure/migrations",
    `${migrationName}.ts`
  );

  if (!fs.existsSync(migrationPath)) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      `❌ Migración no encontrada: ${migrationPath}`
    );
    process.exit(1);
  }

  const dataSource = new DataSource({
    ...datasourceConfig.options,
    migrations: [migrationPath],
    entities: datasourceConfig.options.entities,
  });

  try {
    await dataSource.initialize();
    await dataSource.runMigrations();
    console.log("\x1b[32m%s\x1b[0m", `✅ Migración ${migrationName} aplicada`);
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", `❌ Error: ${error.message}`);
  } finally {
    await dataSource.destroy();
  }
};

main();
