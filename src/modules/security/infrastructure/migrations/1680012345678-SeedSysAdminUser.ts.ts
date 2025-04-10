import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

export class SeedSysAdminUser1680012345678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Generar hash de contraseña
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Insertar credenciales con TypeORM
    await queryRunner.manager.query(`
      INSERT INTO "credentials" (id, username, password, is_active, last_login)
      VALUES (
        uuid_generate_v4(),
        'admin@novalogic.com',
        '${hashedPassword}',
        true,
        NOW()
      )
      ON CONFLICT (username) DO NOTHING;
    `);

    // Obtener la credencial recién creada con TypeORM
    const credencial = await queryRunner.manager.query(
      `SELECT id FROM "credentials" WHERE username = $1`,
      ["admin@novalogic.com"]
    );

    // Validar si se encontró la credencial antes de seguir
    if (!credencial.length) {
      throw new Error("No se encontró la credencial para admin@novalogic.com");
    }

    const credencialId = credencial[0].id;

    // Insertar usuario con referencia a las credenciales
    await queryRunner.manager.query(`
      INSERT INTO "users" (id, full_name, email, role, tenant_id, credentials_id)
      VALUES (
        uuid_generate_v4(),
        'Super Admin',
        'admin@novalogic.com',
        'SYS_ADMIN',
        NULL,
        '${credencialId}'
      )
      ON CONFLICT (email) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.query(`
      DELETE FROM "users" WHERE email = 'admin@novalogic.com';
    `);

    await queryRunner.manager.query(`
      DELETE FROM "credentials" WHERE username = 'admin@novalogic.com';
    `);
  }
}
