import { DataSource } from 'typeorm';
import configuration from 'libs/config/configuration';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const {
  services: {
    task_runner: {
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
  entities: [],
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
