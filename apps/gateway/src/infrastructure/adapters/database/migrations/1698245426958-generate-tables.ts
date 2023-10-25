import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateTables1698245426958 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE public.billing_plan (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"createdAt" timestamp NOT NULL DEFAULT now(),
	"updatedAt" timestamp NOT NULL DEFAULT now(),
	"deletedAt" timestamp NULL,
	"name" varchar(500) NOT NULL,
	"workspaceLimit" int4 NOT NULL,
	"userLimit" int4 NOT NULL,
	"scheduledTaskLimit" int4 NOT NULL,
	"minimumInterval" int4 NOT NULL,
	CONSTRAINT "PK_63f4db8ca9063690ab4dfc3b3da" PRIMARY KEY (id))`);

    await queryRunner.query(`CREATE TABLE public."role" (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"createdAt" timestamp NOT NULL DEFAULT now(),
	"updatedAt" timestamp NOT NULL DEFAULT now(),
	"deletedAt" timestamp NULL,
	"name" varchar(500) NOT NULL,
	CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id))`);

    await queryRunner.query(`CREATE TABLE public."user" (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"roleId" uuid NOT NULL,
	"billingCustomerId" uuid NOT NULL,
	"billingPlanId" uuid NOT NULL,
	"createdAt" timestamp NOT NULL DEFAULT now(),
	"updatedAt" timestamp NOT NULL DEFAULT now(),
	"deletedAt" timestamp NULL,
	"name" varchar(500) NOT NULL,
	email varchar NOT NULL,
	verified bool NOT NULL DEFAULT false,
	"password" varchar NOT NULL,
	CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id))`);

    await queryRunner.query(
      `ALTER TABLE public."user" ADD CONSTRAINT "FK_96c7634e349c4ecfbcb70618cb3" FOREIGN KEY ("billingPlanId") REFERENCES public.billing_plan(id)`,
    );
    await queryRunner.query(
      `ALTER TABLE public."user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES public."role"(id)`,
    );

    await queryRunner.query(`CREATE TABLE public.workspace (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"createdAt" timestamp NOT NULL DEFAULT now(),
	"updatedAt" timestamp NOT NULL DEFAULT now(),
	"deletedAt" timestamp NULL,
	"name" varchar(500) NOT NULL,
	"ownerId" uuid NOT NULL,
	CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY (id))`);

    await queryRunner.query(
      `ALTER TABLE public.workspace ADD CONSTRAINT "FK_51f2194e4a415202512807d2f63" FOREIGN KEY ("ownerId") REFERENCES public."user"(id)`,
    );

    await queryRunner.query(`CREATE TABLE public.workspace_membership (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"createdAt" timestamp NOT NULL DEFAULT now(),
	"updatedAt" timestamp NOT NULL DEFAULT now(),
	"deletedAt" timestamp NULL,
	"workspaceId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "PK_6641ba762220c1f1a86c9379e80" PRIMARY KEY (id))`);

    await queryRunner.query(
      `ALTER TABLE public.workspace_membership ADD CONSTRAINT "FK_a78e067bc8a753d4b007bb066ba" FOREIGN KEY ("workspaceId") REFERENCES public.workspace(id)`,
    );
    await queryRunner.query(
      `ALTER TABLE public.workspace_membership ADD CONSTRAINT "FK_eb8dad60593b84045c064a40b58" FOREIGN KEY ("userId") REFERENCES public."user"(id)`,
    );

    await queryRunner.query(`CREATE TABLE public.scheduled_task (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"createdAt" timestamp NOT NULL DEFAULT now(),
	"updatedAt" timestamp NOT NULL DEFAULT now(),
	"deletedAt" timestamp NULL,
	"ownerId" uuid NOT NULL,
	"workspaceId" uuid NOT NULL,
	"name" varchar(500) NOT NULL,
	protocol varchar NOT NULL,
	host varchar NOT NULL,
	port int4 NOT NULL,
	"interval" int4 NOT NULL,
	"type" varchar NOT NULL,
	active bool NOT NULL,
	payload varchar NOT NULL,
	CONSTRAINT "PK_d690af24e57e30594c1948af1e6" PRIMARY KEY (id))`);

    await queryRunner.query(
      `ALTER TABLE public.scheduled_task ADD CONSTRAINT "FK_1de1e5e55b52bc0a5aed53bbfec" FOREIGN KEY ("ownerId") REFERENCES public."user"(id)`,
    );
    await queryRunner.query(
      `ALTER TABLE public.scheduled_task ADD CONSTRAINT "FK_85d53a8f1e57e344f68961d8702" FOREIGN KEY ("workspaceId") REFERENCES public.workspace(id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
