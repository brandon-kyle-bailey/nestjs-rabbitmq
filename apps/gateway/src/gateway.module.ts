import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { SchedulerModule } from './infrastructure/adapters/scheduler/scheduler.module';
import { CreateOperationController } from './interface/controllers/operation/create-operation.http.controller';
import { CreateOperationService } from './core/application/services/operation/create-operation.service';
import { RequestContextModule } from 'nestjs-request-context';
import { DatabaseModule } from './infrastructure/adapters/database/database.module';
import configuration from 'libs/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationRepositoryEntity } from './core/application/ports/operation/operation.entity';
import { OperationRepository } from './core/application/ports/operation/operation.repository';
import { OperationMapper } from './infrastructure/mappers/operation.mapper';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleOperationService } from './core/application/services/operation/schedule-operation.service';
import { DeleteOperationController } from './interface/controllers/operation/delete-operation.http.controller';
import { DeleteOperationService } from './core/application/services/operation/delete-operation.service';
import { UnscheduleOperationService } from './core/application/services/operation/unschedule-operation.service';
import { GetOperationEventController } from './interface/controllers/operation/get-operation.event.controller';
import { GetOperationService } from './core/application/services/operation/get-operation.service';
import { GetOperationController } from './interface/controllers/operation/get-operation.http.controller';
import { UpdateOperationController } from './interface/controllers/operation/update-operation.http.controller';
import { UpdateOperationService } from './core/application/services/operation/update-operation.service';
import { ListOperationsController } from './interface/controllers/operation/list-operations.http.controller';
import { ListOperationsService } from './core/application/services/operation/list-operations.service';
import { AuthModule } from './infrastructure/adapters/auth/auth.module';
import { PauseOperationController } from './interface/controllers/operation/pause-operation.http.controller';
import { PauseOperationService } from './core/application/services/operation/pause-operation.service';
import { ResumeOperationService } from './core/application/services/operation/resume-operation.service';
import { ResumeOperationController } from './interface/controllers/operation/resume-operation.http.controller';
import { UpdateOperationIntervalController } from './interface/controllers/operation/update-operation-interval.http.controller';
import { UpdateOperationIntervalService } from './core/application/services/operation/update-operation-interval.service';
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
import { ListWorkspacesService } from './core/application/services/workspace/list-workspaces.service';
import { UpdateWorkspaceService } from './core/application/services/workspace/update-workspace.service';
import { CreateWorkspaceController } from './interface/controllers/workspace/create-workspace.http.controller';
import { DeleteWorkspaceController } from './interface/controllers/workspace/delete-workspace.http.controller';
import { GetWorkspaceController } from './interface/controllers/workspace/get-workspace.http.controller';
import { ListWorkspacesController } from './interface/controllers/workspace/list-workspaces.http.controller';

const entities = [
  OperationRepositoryEntity,
  UserRepositoryEntity,
  WorkspaceRepositoryEntity,
];

const repositories = [OperationRepository, UserRepository, WorkspaceRepository];

const mappers = [OperationMapper, UserMapper, WorkspaceMapper];

const services = [
  CreateWorkspaceService,
  UpdateWorkspaceService,
  ListWorkspacesService,
  DeleteWorkspaceService,
  CreateOperationService,
  GetOperationService,
  DeleteOperationService,
  ScheduleOperationService,
  UnscheduleOperationService,
  UpdateOperationService,
  ListOperationsService,
  PauseOperationService,
  ResumeOperationService,
  UpdateOperationIntervalService,
  CreateUserService,
  UpdateUserService,
  GetUserService,
  DeleteUserService,
  SigninUserService,
];

const controllers = [
  CreateWorkspaceController,
  GetWorkspaceController,
  ListWorkspacesController,
  DeleteWorkspaceController,
  GetOperationController,
  CreateOperationController,
  DeleteOperationController,
  GetOperationEventController,
  UpdateOperationController,
  ListOperationsController,
  PauseOperationController,
  ResumeOperationController,
  UpdateOperationIntervalController,
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
    SchedulerModule,
    AuthModule,
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
