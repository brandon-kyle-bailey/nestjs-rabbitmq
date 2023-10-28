import { DataSource } from 'typeorm';
import configuration from 'libs/config/configuration';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { UserRepositoryEntity } from 'apps/gateway/src/core/application/ports/user/user.entity';
import { WorkspaceRepositoryEntity } from 'apps/gateway/src/core/application/ports/workspace/workspace.entity';
import { BillingPlanRepositoryEntity } from 'apps/gateway/src/core/application/ports/billing-plan/billing-plan.entity';
import { RoleRepositoryEntity } from 'apps/gateway/src/core/application/ports/role/role.entity';
import { WorkspaceMembershipRepositoryEntity } from 'apps/gateway/src/core/application/ports/workspace-membership/workspace-membership.entity';
import { ScheduledTaskRepositoryEntity } from 'apps/gateway/src/core/application/ports/scheduled-task/scheduled-task.entity';
import { NotificationIntegrationRepositoryEntity } from 'apps/gateway/src/core/application/ports/notification-integration/notification-integration.entity';
import { ScheduledTaskIncidentNotificationRepositoryEntity } from 'apps/gateway/src/core/application/ports/scheduled-task-incident-notification/scheduled-task-incident-notification.entity';

const {
  services: {
    gateway: {
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
  entities: [
    UserRepositoryEntity,
    WorkspaceRepositoryEntity,
    BillingPlanRepositoryEntity,
    RoleRepositoryEntity,
    WorkspaceMembershipRepositoryEntity,
    ScheduledTaskRepositoryEntity,
    NotificationIntegrationRepositoryEntity,
    ScheduledTaskIncidentNotificationRepositoryEntity,
  ],
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
