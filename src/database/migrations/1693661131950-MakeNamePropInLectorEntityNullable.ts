import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeNamePropInLectorEntityNullable1693661131950
  implements MigrationInterface
{
  name = 'MakeNamePropInLectorEntityNullable1693661131950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lectors" ALTER COLUMN "name" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lectors" ALTER COLUMN "name" SET NOT NULL`,
    );
  }
}
