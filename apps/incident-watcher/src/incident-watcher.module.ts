import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'libs/config/configuration';
import { DatabaseModule } from './infrastructure/adapters/database/database.module';
import { NotificationsModule } from './infrastructure/adapters/notifications/notifications.module';
import { GatewayModule } from './infrastructure/adapters/gateway/gateway.module';
import { TaskRunnerCompleteEventController } from './interface/controllers/task-runner-complete.event.controller';
import { VerifyScheduledTaskIncidentService } from './core/application/services/verify-scheduled-task-incident.service';

const entities = [];

const controllers = [TaskRunnerCompleteEventController];

const repositories = [];

const mappers = [];

const services = [VerifyScheduledTaskIncidentService];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CqrsModule,
    DatabaseModule,
    GatewayModule,
    NotificationsModule,
    TypeOrmModule.forFeature(entities),
    EventEmitterModule.forRoot({ global: true }),
  ],
  controllers,
  providers: [Logger, ConfigService, ...repositories, ...mappers, ...services],
})
export class IncidentWatcherModule {}
