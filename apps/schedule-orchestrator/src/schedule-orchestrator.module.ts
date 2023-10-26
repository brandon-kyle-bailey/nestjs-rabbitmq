import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import configuration from 'libs/config/configuration';
import { DatabaseModule } from './infrastructure/adapters/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleMapper } from './infrastructure/mappers/schedule.mapper';
import { ScheduleRepository } from './core/application/ports/schedule/schedule.repository';
import { ScheduleRepositoryEntity } from './core/application/ports/schedule/schedule.entity';
import { TaskRunnerModule } from './infrastructure/adapters/task-runner/task-runner.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CreateScheduleEventController } from './interface/controllers/create-schedule.event.controller';
import { DeleteScheduleEventController } from './interface/controllers/delete-schedule.event.controller';
import { CreateScheduleService } from './core/application/services/create-schedule.service';
import { DeleteScheduleService } from './core/application/services/delete-schedule.service';
import { LoadScheduleService } from './core/application/services/load-schedule.service';
import { UnloadScheduleService } from './core/application/services/unload-schedule.service';
import { PickupSchedulesCliController } from './interface/controllers/pickup-schedules.cli.controller';
import { PickupSchedulesService } from './core/application/services/pickup-schedules.service';

const entities = [ScheduleRepositoryEntity];

const controllers = [
  CreateScheduleEventController,
  DeleteScheduleEventController,
  PickupSchedulesCliController,
];

const repositories = [ScheduleRepository];

const mappers = [ScheduleMapper];

const services = [
  CreateScheduleService,
  DeleteScheduleService,
  LoadScheduleService,
  UnloadScheduleService,
  PickupSchedulesService,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CqrsModule,
    DatabaseModule,
    TaskRunnerModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature(entities),
    EventEmitterModule.forRoot({ global: true }),
  ],
  controllers,
  providers: [Logger, ConfigService, ...repositories, ...mappers, ...services],
})
export class ScheduleOrchestratorModule {}
