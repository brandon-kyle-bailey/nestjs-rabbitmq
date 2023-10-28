import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTables1698468129815 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE public.schedule (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"scheduledTaskId" uuid NOT NULL,
	"createdAt" timestamp NOT NULL DEFAULT now(),
	"updatedAt" timestamp NOT NULL DEFAULT now(),
	"deletedAt" timestamp NULL,
	protocol varchar NOT NULL,
	host varchar NOT NULL,
	port int4 NOT NULL,
	"interval" int4 NOT NULL,
	"type" varchar NOT NULL,
	active bool NOT NULL,
	payload varchar NOT NULL,
	CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY (id))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
