import { DataSource } from 'typeorm';
import configuration from 'libs/config/configuration';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ScheduleRepositoryEntity } from 'apps/schedule-orchestrator/src/core/application/ports/schedule/schedule.entity';

const {
  services: {
    schedule_orchestrator: {
      database: {
        postgres: { driver, host, port, username, password, name: database },
      },
    },
  },
} = configuration();

export const databaseConfiguration: PostgresConnectionOptions = {
  nativeDriver: 'pg',
  host,
  port,
  username,
  password,
  database,
  entities: [ScheduleRepositoryEntity],
  migrations: [__dirname + '/./migrations/*'],
  migrationsRun: true,
  synchronize: process.env.NODE_ENV === 'development' ? true : false,
  type: 'postgres',
};

export const dataSource = new DataSource(
  databaseConfiguration as unknown as PostgresConnectionOptions,
);

export const adapters = [
  {
    provide: driver,
    useFactory: async () => dataSource,
  },
];
