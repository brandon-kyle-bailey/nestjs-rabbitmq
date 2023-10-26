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

const entities = [TaskRepositoryEntity];

const controllers = [RunTaskEventController];

const repositories = [TaskRepository];

const mappers = [TaskMapper];

const services = [RunTaskService];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CqrsModule,
    HttpModule,
    DatabaseModule,
    TypeOrmModule.forFeature(entities),
    EventEmitterModule.forRoot({ global: true }),
  ],
  controllers,
  providers: [Logger, ConfigService, ...repositories, ...mappers, ...services],
})
export class TaskRunnerModule {}
