import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import configuration from 'libs/config/configuration';
import { DatabaseModule } from './infrastructure/adapters/database/database.module';
import { RequestContextModule } from 'nestjs-request-context';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios';
import { ProcessEventEventController } from './interface/controllers/process-event.event.controller';
import { ProcessEventMapper } from './infrastructure/mappers/process-event.mapper';
import { ProcessEventService } from './core/application/services/process-event.service';
import { ProcessEventRepository } from './core/application/ports/process-event/process-event.repository';
import { ProcessEventRepositoryEntity } from './core/application/ports/process-event/process-event.entity';
import { GatewayModule } from './infrastructure/adapters/gateway/gateway.module';

const entities = [ProcessEventRepositoryEntity];

const repositories = [ProcessEventRepository];

const mappers = [ProcessEventMapper];

const services = [ProcessEventService];

const controllers = [ProcessEventEventController];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CqrsModule,
    DatabaseModule,
    RequestContextModule,
    GatewayModule,
    TypeOrmModule.forFeature(entities),
    EventEmitterModule.forRoot({ global: true }),
    HttpModule,
  ],
  controllers,
  providers: [Logger, ConfigService, ...repositories, ...mappers, ...services],
})
export class ProcessorModule {}
