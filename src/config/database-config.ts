import { DataSourceOptions } from 'typeorm';
import path from 'path';

export const getTypeOrmConfig = (isMigrationRun = true): DataSourceOptions => {
  const migrationsPath = path.join(
    __dirname,
    '../../',
    '**/migrations/*{.ts,.js}',
  );
  const entitiesPath = path.join(__dirname, '../../', '**/*.entity{.ts,.js}');

  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_NAME,
    entities: [entitiesPath],
    migrations: [migrationsPath],
    migrationsTableName: 'migrations',
    migrationsRun: isMigrationRun,
    logging: true,
    synchronize: false,
  };
};
