import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { RequestContextModule } from 'nestjs-request-context';
import { DatabaseModule } from './infrastructure/adapters/database/database.module';
import configuration from 'libs/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './infrastructure/adapters/auth/auth.module';
import { UserRepositoryEntity } from './core/application/ports/user/user.entity';
import { UserRepository } from './core/application/ports/user/user.repository';
import { UserMapper } from './infrastructure/mappers/user.mapper';
import { GetUserController } from './interface/controllers/user/get-user.http.controller';
import { UpdateUserController } from './interface/controllers/user/update-user.http.controller';
import { CreateUserController } from './interface/controllers/user/create-user.http.controller';
import { DeleteUserController } from './interface/controllers/user/delete-user.http.controller';
import { CreateUserService } from './core/application/services/user/create-user.service';
import { DeleteUserService } from './core/application/services/user/delete-user.service';
import { GetUserService } from './core/application/services/user/get-user.service';
import { UpdateUserService } from './core/application/services/user/update-user.service';
import { SigninUserController } from './interface/controllers/user/sign-in-user.http.controller';
import { SigninUserService } from './core/application/services/user/signin-user.service';
import { AuthGuard } from './core/application/services/auth/auth.guard';
import { WorkspaceRepositoryEntity } from './core/application/ports/workspace/workspace.entity';
import { WorkspaceRepository } from './core/application/ports/workspace/workspace.repository';
import { WorkspaceMapper } from './infrastructure/mappers/workspace.mapper';
import { CreateWorkspaceService } from './core/application/services/workspace/create-workspace.service';
import { DeleteWorkspaceService } from './core/application/services/workspace/delete-workspace.service';
import { UpdateWorkspaceService } from './core/application/services/workspace/update-workspace.service';
import { CreateWorkspaceController } from './interface/controllers/workspace/create-workspace.http.controller';
import { DeleteWorkspaceController } from './interface/controllers/workspace/delete-workspace.http.controller';
import { GetWorkspaceController } from './interface/controllers/workspace/get-workspace.http.controller';
import { ListWorkspacesController } from './interface/controllers/workspace/list-workspaces.http.controller';
import { NotificationsModule } from './infrastructure/adapters/notifications/notifications.module';
import { VerifyEmailEventController } from './interface/controllers/user/verify-email.event.controller';
import { BillingPlanRepositoryEntity } from './core/application/ports/billing-plan/billing-plan.entity';
import { RoleRepositoryEntity } from './core/application/ports/role/role.entity';
import { RoleRepository } from './core/application/ports/role/role.repository';
import { BillingPlanRepository } from './core/application/ports/billing-plan/billing-plan.repository';
import { RoleMapper } from './infrastructure/mappers/role.mapper';
import { BillingPlanMapper } from './infrastructure/mappers/billing-plan.mapper';
import { SendVerificationEmailService } from './core/application/services/user/send-verification-email.service';
import { VeriyUserController } from './interface/controllers/user/verify-user.http.controller';
import { RefreshUserTokenController } from './interface/controllers/user/refresh-token.http.controller';
import { RefresUserTokenService } from './core/application/services/user/refresh-user-token.service';
import { WorkspaceMembershipRepository } from './core/application/ports/workspace-membership/workspace-membership.repository';
import { WorkspaceMembershipMapper } from './infrastructure/mappers/workspace-membership.mapper';
import { WorkspaceMembershipRepositoryEntity } from './core/application/ports/workspace-membership/workspace-membership.entity';
import { ScheduledTaskRepositoryEntity } from './core/application/ports/scheduled-task/scheduled-task.entity';
import { ScheduledTaskRepository } from './core/application/ports/scheduled-task/scheduled-task.repository';
import { ScheduledTaskMapper } from './infrastructure/mappers/scheduled-task.mapper';
import { GetWorkspaceService } from './core/application/services/workspace/get-workspace.service';
import { CreateScheduledTaskService } from './core/application/services/scheduled-task/create-scheduled-task.service';
import { DeleteScheduledTaskService } from './core/application/services/scheduled-task/delete-scheduled-task.service';
import { GetScheduledTaskService } from './core/application/services/scheduled-task/get-scheduled-task.service';
import { UpdateScheduledTaskService } from './core/application/services/scheduled-task/update-scheduled-task.service';
import { UpdateWorkspaceController } from './interface/controllers/workspace/update-workspace.http.controller';
import { CreateScheduledTaskController } from './interface/controllers/scheduled-task/create-scheduled-task.http.controller';
import { DeleteScheduledTaskController } from './interface/controllers/scheduled-task/delete-scheduled-task.http.controller';
import { GetScheduledTaskController } from './interface/controllers/scheduled-task/get-scheduled-task.http.controller';
import { ListScheduledTaskController } from './interface/controllers/scheduled-task/list-scheduled-task.http.controller';
import { UpdateScheduledTaskController } from './interface/controllers/scheduled-task/update-scheduled-task.http.controller';
import { ScheduleOrchestratorModule } from './infrastructure/adapters/schedule-orchestrator/schedule-orchestrator.module';
import { ListWorkspacesService } from './core/application/services/workspace/list-workspace.service';
import { ListScheduledTaskService } from './core/application/services/scheduled-task/list-scheduled-task.service';

const entities = [
  UserRepositoryEntity,
  WorkspaceRepositoryEntity,
  BillingPlanRepositoryEntity,
  RoleRepositoryEntity,
  WorkspaceMembershipRepositoryEntity,
  ScheduledTaskRepositoryEntity,
];

const repositories = [
  UserRepository,
  WorkspaceRepository,
  RoleRepository,
  BillingPlanRepository,
  WorkspaceMembershipRepository,
  ScheduledTaskRepository,
];

const mappers = [
  UserMapper,
  WorkspaceMapper,
  RoleMapper,
  BillingPlanMapper,
  WorkspaceMembershipMapper,
  ScheduledTaskMapper,
];

const services = [
  ListScheduledTaskService,
  GetWorkspaceService,
  CreateWorkspaceService,
  UpdateWorkspaceService,
  DeleteWorkspaceService,
  GetScheduledTaskService,
  CreateScheduledTaskService,
  UpdateScheduledTaskService,
  DeleteScheduledTaskService,
  RefresUserTokenService,
  SendVerificationEmailService,
  CreateUserService,
  UpdateUserService,
  GetUserService,
  DeleteUserService,
  SigninUserService,
  ListWorkspacesService,
];

const controllers = [
  CreateScheduledTaskController,
  GetScheduledTaskController,
  ListScheduledTaskController,
  UpdateScheduledTaskController,
  DeleteScheduledTaskController,
  RefreshUserTokenController,
  VeriyUserController,
  VerifyEmailEventController,
  CreateWorkspaceController,
  GetWorkspaceController,
  ListWorkspacesController,
  UpdateWorkspaceController,
  DeleteWorkspaceController,
  GetUserController,
  UpdateUserController,
  CreateUserController,
  DeleteUserController,
  SigninUserController,
];

const guards = [AuthGuard];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CqrsModule,
    DatabaseModule,
    AuthModule,
    NotificationsModule,
    ScheduleOrchestratorModule,
    RequestContextModule,
    TypeOrmModule.forFeature(entities),
    EventEmitterModule.forRoot({ global: true }),
  ],
  controllers,
  providers: [
    Logger,
    ConfigService,
    ...repositories,
    ...mappers,
    ...services,
    ...guards,
  ],
})
export class GatewayModule {}
