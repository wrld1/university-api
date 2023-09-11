import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeLectorCourseEntity1694037548859
  implements MigrationInterface
{
  name = 'ChangeLectorCourseEntity1694037548859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lector_course" DROP CONSTRAINT "FK_fa21194644d188132582b0d1a3f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fa21194644d188132582b0d1a3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_67ca379415454fe43871951552"`,
    );
    await queryRunner.query(`ALTER TABLE "lector_course" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "lector_course" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" DROP CONSTRAINT "PK_79cf0f064235769277ce94c75f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD CONSTRAINT "PK_a258ae675f3378b94898c00a148" PRIMARY KEY ("lector_id", "course_id", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" DROP CONSTRAINT "PK_a258ae675f3378b94898c00a148"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD CONSTRAINT "PK_79cf0f064235769277ce94c75f7" PRIMARY KEY ("lector_id", "course_id")`,
    );
    await queryRunner.query(`ALTER TABLE "marks" DROP COLUMN "mark"`);
    await queryRunner.query(`ALTER TABLE "marks" ADD "mark" numeric NOT NULL`);
    await queryRunner.query(
      `CREATE INDEX "IDX_fa21194644d188132582b0d1a3" ON "lector_course" ("lector_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_67ca379415454fe43871951552" ON "lector_course" ("course_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD CONSTRAINT "FK_fa21194644d188132582b0d1a3f" FOREIGN KEY ("lector_id") REFERENCES "lectors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lector_course" DROP CONSTRAINT "FK_fa21194644d188132582b0d1a3f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_67ca379415454fe43871951552"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fa21194644d188132582b0d1a3"`,
    );
    await queryRunner.query(`ALTER TABLE "marks" DROP COLUMN "mark"`);
    await queryRunner.query(
      `ALTER TABLE "marks" ADD "mark" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" DROP CONSTRAINT "PK_79cf0f064235769277ce94c75f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD CONSTRAINT "PK_a258ae675f3378b94898c00a148" PRIMARY KEY ("lector_id", "course_id", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" DROP CONSTRAINT "PK_a258ae675f3378b94898c00a148"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD CONSTRAINT "PK_79cf0f064235769277ce94c75f7" PRIMARY KEY ("lector_id", "course_id")`,
    );
    await queryRunner.query(`ALTER TABLE "lector_course" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_67ca379415454fe43871951552" ON "lector_course" ("course_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fa21194644d188132582b0d1a3" ON "lector_course" ("lector_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD CONSTRAINT "FK_fa21194644d188132582b0d1a3f" FOREIGN KEY ("lector_id") REFERENCES "lectors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
