import { DataSource } from 'typeorm';
import configuration from 'libs/config/configuration';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { UserRepositoryEntity } from 'apps/gateway/src/core/application/ports/user/user.entity';
import { WorkspaceRepositoryEntity } from 'apps/gateway/src/core/application/ports/workspace/workspace.entity';
import { BillingPlanRepositoryEntity } from 'apps/gateway/src/core/application/ports/billing-plan/billing-plan.entity';
import { RoleRepositoryEntity } from 'apps/gateway/src/core/application/ports/role/role.entity';

const {
  services: {
    gateway: {
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
  entities: [
    UserRepositoryEntity,
    WorkspaceRepositoryEntity,
    BillingPlanRepositoryEntity,
    RoleRepositoryEntity,
  ],
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
