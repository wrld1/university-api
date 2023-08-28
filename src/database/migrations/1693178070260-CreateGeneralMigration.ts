import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGeneralMigration1693178070260 implements MigrationInterface {
  name = 'CreateGeneralMigration1693178070260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "groups" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "students" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "surname" character varying NOT NULL, "email" character varying NOT NULL, "age" numeric NOT NULL, "image_path" character varying, "group_id" integer, CONSTRAINT "UQ_25985d58c714a4a427ced57507b" UNIQUE ("email"), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "marks" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "mark" character varying NOT NULL, "studentId" integer, "lectorId" integer, "courseId" integer, CONSTRAINT "PK_051deeb008f7449216d568872c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "hours" numeric NOT NULL, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lectors" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_87eda9bf8c85d84a6b18dfc4991" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lector_course" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lector_id" integer NOT NULL, "course_id" integer NOT NULL, CONSTRAINT "PK_a258ae675f3378b94898c00a148" PRIMARY KEY ("id", "lector_id", "course_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" DROP CONSTRAINT "PK_a258ae675f3378b94898c00a148"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD CONSTRAINT "PK_79cf0f064235769277ce94c75f7" PRIMARY KEY ("lector_id", "course_id")`,
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
    await queryRunner.query(
      `CREATE INDEX "IDX_fa21194644d188132582b0d1a3" ON "lector_course" ("lector_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_67ca379415454fe43871951552" ON "lector_course" ("course_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "students" ADD CONSTRAINT "FK_b9f6fcd8a397ee5b503191dd7c3" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "marks" ADD CONSTRAINT "FK_aa9e8312f7ce21846e5e2c3152a" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "marks" ADD CONSTRAINT "FK_136510b31d02372d5fa607501a6" FOREIGN KEY ("lectorId") REFERENCES "lectors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "marks" ADD CONSTRAINT "FK_5ab67ba1160d5b397d315f1ed8e" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD CONSTRAINT "FK_fa21194644d188132582b0d1a3f" FOREIGN KEY ("lector_id") REFERENCES "lectors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD CONSTRAINT "FK_67ca379415454fe438719515529" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lector_course" DROP CONSTRAINT "FK_67ca379415454fe438719515529"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" DROP CONSTRAINT "FK_fa21194644d188132582b0d1a3f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marks" DROP CONSTRAINT "FK_5ab67ba1160d5b397d315f1ed8e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marks" DROP CONSTRAINT "FK_136510b31d02372d5fa607501a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "marks" DROP CONSTRAINT "FK_aa9e8312f7ce21846e5e2c3152a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "FK_b9f6fcd8a397ee5b503191dd7c3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_67ca379415454fe43871951552"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fa21194644d188132582b0d1a3"`,
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
      `ALTER TABLE "lector_course" DROP CONSTRAINT "PK_79cf0f064235769277ce94c75f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lector_course" ADD CONSTRAINT "PK_a258ae675f3378b94898c00a148" PRIMARY KEY ("id", "lector_id", "course_id")`,
    );
    await queryRunner.query(`DROP TABLE "lector_course"`);
    await queryRunner.query(`DROP TABLE "lectors"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TABLE "marks"`);
    await queryRunner.query(`DROP TABLE "students"`);
    await queryRunner.query(`DROP TABLE "groups"`);
  }
}
