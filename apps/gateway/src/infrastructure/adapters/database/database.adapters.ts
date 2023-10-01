import { OperationRepositoryEntity } from 'apps/gateway/src/core/application/ports/operation/operation.entity';
import configuration from 'libs/config/configuration';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const {
  services: {
    gateway: {
      database: { driver, host, port, username, password, name },
    },
  },
} = configuration();

export const databaseConfiguration = {
  type: 'postgres',
  nativeDriver: 'pg',
  host,
  port,
  username,
  password,
  database: name,
  entities: [OperationRepositoryEntity],
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
