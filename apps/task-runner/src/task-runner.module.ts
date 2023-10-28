import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'libs/config/configuration';
import { DatabaseModule } from './infrastructure/adapters/database/database.module';
import { TaskRepositoryEntity } from './core/application/ports/task/task.entity';
import { RunTaskEventController } from './interface/controllers/run-task.event.controller';
import { TaskRepository } from './core/application/ports/task/task.repository';
import { TaskMapper } from './infrastructure/mappers/task.mapper';
import { HttpModule } from '@nestjs/axios';
import { RunTaskService } from './core/application/services/run-task.service';
import { PublishTaskResultEventController } from './interface/controllers/publish-task-result.event.controller';
import { PublishTaskResultGateway } from './core/application/services/publish-task-result.gateway';
import { PromoteTaskResultToIncidentWatcherService } from './core/application/services/promote-task-result-to-incident-watcher.service';
import { PromoteTaskResultToIncidentWatcherEventController } from './interface/controllers/promote-task-result-to-incident-watcher.event.controller';
import { IncidentWatcherModule } from './infrastructure/adapters/incident-watcher/incident-watcher.module';

const entities = [TaskRepositoryEntity];

const controllers = [
  RunTaskEventController,
  PublishTaskResultEventController,
  PromoteTaskResultToIncidentWatcherEventController,
];

const repositories = [TaskRepository];

const mappers = [TaskMapper];

const services = [
  RunTaskService,
  PublishTaskResultGateway,
  PromoteTaskResultToIncidentWatcherService,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CqrsModule,
    HttpModule,
    DatabaseModule,
    IncidentWatcherModule,
    TypeOrmModule.forFeature(entities),
    EventEmitterModule.forRoot({ global: true }),
  ],
  controllers,
  providers: [Logger, ConfigService, ...repositories, ...mappers, ...services],
})
export class TaskRunnerModule {}
