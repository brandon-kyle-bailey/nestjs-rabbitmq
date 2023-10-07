import { ScheduleRepositoryEntity } from 'apps/scheduler/src/core/application/ports/schedule/schedule.entity';
import configuration from 'libs/config/configuration';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const {
  services: {
    scheduler: {
      database: {
        postgres: { driver, host, port, username, password, name: database },
      },
    },
  },
} = configuration();

export const databaseConfiguration = {
  type: driver,
  nativeDriver: 'pg',
  host,
  port,
  username,
  password,
  database,
  entities: [ScheduleRepositoryEntity],
  synchronize: process.env.NODE_ENV === 'development' ? true : false,
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
