import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUserRoles1698245426960 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public."role"(id, "createdAt", "updatedAt", "deletedAt", "name") VALUES(uuid_generate_v4(), now(), now(), NULL, 'OWNER')`,
    );
    await queryRunner.query(
      `INSERT INTO public."role"(id, "createdAt", "updatedAt", "deletedAt", "name") VALUES(uuid_generate_v4(), now(), now(), NULL, 'ADMIN')`,
    );
    await queryRunner.query(
      `INSERT INTO public."role"(id, "createdAt", "updatedAt", "deletedAt", "name") VALUES(uuid_generate_v4(), now(), now(), NULL, 'USER')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
