import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSysAdminUserRoleAndName1680012345999
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.query(`
      UPDATE "users"
      SET full_name = 'Super Admin',
          role = 'ADMIN'
      WHERE id = '0cb7a0e7-bb0b-45c1-a804-6f43ccee8ede';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.query(`
      UPDATE "users"
      SET full_name = 'Nombre Anterior',
          role = 'SYS_ADMIN'
      WHERE id = '0cb7a0e7-bb0b-45c1-a804-6f43ccee8ede';
    `);
  }
}
