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

const entities = [ScheduleRepositoryEntity];

const repositories = [ScheduleRepository];

const mappers = [ScheduleMapper];

const services = [CreateScheduleService, DeleteScheduleService];

const controllers = [
  CreateScheduleEventController,
  DeleteScheduleEventController,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CqrsModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature(entities),
    EventEmitterModule.forRoot({ global: true }),
    ProcessorModule,
  ],
  controllers,
  providers: [Logger, ConfigService],
})
export class SchedulerModule {}
