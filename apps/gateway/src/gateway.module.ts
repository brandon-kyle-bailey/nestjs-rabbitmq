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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule,
    DatabaseModule,
    SchedulerModule,
    RequestContextModule,
    TypeOrmModule.forFeature([OperationRepositoryEntity]),
    EventEmitterModule.forRoot({ global: true }),
  ],
  controllers: [CreateOperationController],
  providers: [
    DatabaseModule,
    ConfigService,
    Logger,
    CreateOperationService,
    OperationRepository,
    OperationMapper,
    ScheduleOperationService,
  ],
})
export class GatewayModule {}
