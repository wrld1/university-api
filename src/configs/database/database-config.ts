import { DataSourceOptions, getMetadataArgsStorage } from 'typeorm';
import * as process from 'process';
import path, { extname } from 'path';

export const databaseConfiguration = (
  isMigrationRun = true,
): DataSourceOptions => {
  const env = process.env.APP_ENV;
  const migrationFolder =
    env === 'local'
      ? path.join(__dirname, '../../database/migrations')
      : 'database/migrations';
  const ext = extname(__filename);

  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
      `**/*.entity${ext}`,
      ...getMetadataArgsStorage().tables.map((tbl) => tbl.target),
    ],
    migrations: [`${migrationFolder}/*${ext}`],
    migrationsTableName: 'migrations',
    migrationsRun: isMigrationRun,
    logging: true,
    synchronize: false,
  };
};
