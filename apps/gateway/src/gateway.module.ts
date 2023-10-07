import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { SchedulerModule } from './infrastructure/adapters/scheduler/scheduler.module';
import { CreateOperationController } from './interface/controllers/create-operation.http.controller';
import { CreateOperationService } from './core/application/services/create-operation.service';
import { RequestContextModule } from 'nestjs-request-context';
import { DatabaseModule } from './infrastructure/adapters/database/database.module';
import configuration from 'libs/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationRepositoryEntity } from './core/application/ports/operation/operation.entity';
import { OperationRepository } from './core/application/ports/operation/operation.repository';
import { OperationMapper } from './infrastructure/mappers/operation.mapper';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleOperationService } from './core/application/services/schedule-operation.service';
import { DeleteOperationController } from './interface/controllers/delete-operation.http.controller';
import { DeleteOperationService } from './core/application/services/delete-operation.service';
import { UnscheduleOperationService } from './core/application/services/unschedule-operation.service';
import { GetOperationEventController } from './interface/controllers/get-operation.event.controller';
import { GetOperationService } from './core/application/services/get-operation.service';
import { GetOperationController } from './interface/controllers/get-operation.http.controller';
import { UpdateOperationController } from './interface/controllers/update-operation.http.controller';
import { UpdateOperationService } from './core/application/services/update-operation.service';
import { ListOperationsController } from './interface/controllers/list-operations.http.controller';
import { ListOperationsService } from './core/application/services/list-operations.service';
import { AuthModule } from './infrastructure/adapters/auth/auth.module';
import { PauseOperationController } from './interface/controllers/pause-operation.http.controller';
import { PauseOperationService } from './core/application/services/pause-operation.service';
import { ResumeOperationService } from './core/application/services/resume-operation.service';
import { ResumeOperationController } from './interface/controllers/resume-operation.http.controller';
import { UpdateOperationIntervalController } from './interface/controllers/update-operation-interval.http.controller';
import { UpdateOperationIntervalService } from './core/application/services/update-operation-interval.service';

const entities = [OperationRepositoryEntity];

const repositories = [OperationRepository];

const mappers = [OperationMapper];

const services = [
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
];

const controllers = [
  GetOperationController,
  CreateOperationController,
  DeleteOperationController,
  GetOperationEventController,
  UpdateOperationController,
  ListOperationsController,
  PauseOperationController,
  ResumeOperationController,
  UpdateOperationIntervalController,
];

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
  providers: [Logger, ConfigService, ...repositories, ...mappers, ...services],
})
export class GatewayModule {}
