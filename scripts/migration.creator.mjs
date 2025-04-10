import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Configuración de rutas ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validación de parámetros
const [moduleName, migrationName] = process.argv.slice(2);

if (!moduleName || !migrationName) {
  console.error(
    "\x1b[31m%s\x1b[0m", // Código para color rojo
    "Error: Debes especificar módulo y nombre de migración\n\nUso: npm run migration:create -- <module-name> <migration-name>\n"
  );
  process.exit(1);
}

// Generar ruta de migración
const generateMigrationPath = () => {
  const timestamp = Date.now();
  return path.join(
    __dirname,
    "..",
    "src",
    moduleName.toLowerCase(),
    "infrastructure/migrations",
    `${timestamp}-${migrationName}`
  );
};

// Ejecución principal
const main = async () => {
  try {
    const migrationPath = generateMigrationPath();

    // Ejecutar comando TypeORM
    execSync(`npx typeorm-ts-node-commonjs migration:create ${migrationPath}`, {
      stdio: "pipe",
      encoding: "utf-8",
    });

    // Mensaje de éxito
    console.log(
      "\x1b[32m%s\x1b[0m", 
      `\n✅ Migración creada en: ${migrationPath}.ts\n`
    );
  } catch (error) {
    // Manejo de errores detallado
    console.error(
      "\x1b[31m%s\x1b[0m", 
      `\n❌ Error al crear la migración: ${error.message}`
    );
    process.exit(1);
  }
};

// Iniciar script
main();
