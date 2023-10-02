import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'libs/config/configuration';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './infrastructure/adapters/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ProcessorModule } from './infrastructure/adapters/processor/processor.module';
import { ScheduleMapper } from './infrastructure/mappers/schedule.mapper';
import { ScheduleRepositoryEntity } from './core/application/ports/schedule/schedule.entity';
import { ScheduleRepository } from './core/application/ports/schedule/schedule.repository';
import { CreateScheduleService } from './core/application/services/create-schedule.service';
import { DeleteScheduleService } from './core/application/services/delete-schedule.service';
import { CreateScheduleEventController } from './interface/controllers/create-schedule.event.controller';
import { DeleteScheduleEventController } from './interface/controllers/delete-schedule.event.controller';
import { RequestContextModule } from 'nestjs-request-context';
import { LoadScheduleService } from './core/application/services/load-schedule.service';
import { UnloadScheduleService } from './core/application/services/unload-schedule.service';
import { PickupSchedulesService } from './core/application/services/pickup-schedules.service';
import { PickupSchedulesCliController } from './interface/controllers/pickup-schedules.cli.controller';

const entities = [ScheduleRepositoryEntity];

const repositories = [ScheduleRepository];

const mappers = [ScheduleMapper];

const services = [
  CreateScheduleService,
  DeleteScheduleService,
  LoadScheduleService,
  UnloadScheduleService,
  PickupSchedulesService,
];

const controllers = [
  CreateScheduleEventController,
  DeleteScheduleEventController,
  PickupSchedulesCliController,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CqrsModule,
    DatabaseModule,
    ProcessorModule,
    RequestContextModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature(entities),
    EventEmitterModule.forRoot({ global: true }),
  ],
  controllers,
  providers: [Logger, ConfigService, ...repositories, ...mappers, ...services],
})
export class SchedulerModule {}
