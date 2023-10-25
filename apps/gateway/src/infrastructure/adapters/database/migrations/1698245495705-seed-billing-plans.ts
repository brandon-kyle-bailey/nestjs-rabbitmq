import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedBillingPlans1698245495705 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public.billing_plan(id, "createdAt", "updatedAt", "deletedAt", "name", "workspaceLimit", "userLimit", "scheduledTaskLimit", "minimumInterval") VALUES(uuid_generate_v4(), now(), now(), NULL, 'FREE', -1, -1, -1, -1)`,
    );
    await queryRunner.query(
      `INSERT INTO public.billing_plan(id, "createdAt", "updatedAt", "deletedAt", "name", "workspaceLimit", "userLimit", "scheduledTaskLimit", "minimumInterval") VALUES(uuid_generate_v4(), now(), now(), NULL, 'BUSINESS', -1, -1, -1, -1)`,
    );
    await queryRunner.query(
      `INSERT INTO public.billing_plan(id, "createdAt", "updatedAt", "deletedAt", "name", "workspaceLimit", "userLimit", "scheduledTaskLimit", "minimumInterval") VALUES(uuid_generate_v4(), now(), now(), NULL, 'ENTERPRISE', -1, -1, -1, -1)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
