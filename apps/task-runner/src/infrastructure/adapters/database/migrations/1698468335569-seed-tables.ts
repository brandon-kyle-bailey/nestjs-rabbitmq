import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTables1698468335569 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE public.task (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"scheduledTaskId" uuid NOT NULL,
	"createdAt" timestamp NOT NULL DEFAULT now(),
	"updatedAt" timestamp NOT NULL DEFAULT now(),
	"deletedAt" timestamp NULL,
	status int4 NOT NULL,
	duration int4 NOT NULL,
	response varchar NOT NULL,
	CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY (id))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
