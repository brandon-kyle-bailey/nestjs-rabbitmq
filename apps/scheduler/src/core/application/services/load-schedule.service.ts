import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import {
  ScheduleCreatedDomainEvent,
  ScheduleType,
} from '../../domain/entities/schedule.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ScheduleIntegrationEvents } from 'libs/events/schedule.events';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';

@Injectable()
export class LoadScheduleService implements OnModuleInit, OnModuleDestroy {
  constructor(
    protected readonly logger: Logger,
    @Inject(TransportAdapterNames.TransportProcessorAdapterService)
    protected service: ClientProxy,
    protected readonly schedulerRegistry: SchedulerRegistry,
  ) {}
  async onModuleInit() {
    await this.service.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
  }

  @OnEvent(ScheduleCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: ScheduleCreatedDomainEvent): Promise<void> {
    this.logger.debug(
      'LoadScheduleService.handle called with event',
      JSON.stringify(event),
    );
    if (this.schedulerRegistry.doesExist(event.type, event.operationId)) {
      this.logger.debug(
        `Schedule already exists for operation ${event.operationId}. Returning`,
      );
      return;
    }
    switch (event.type as ScheduleType) {
      case ScheduleType.Cron:
        this.logger.debug('Cron type not supported yet');
        return;
      case ScheduleType.Interval:
        this.schedulerRegistry.addInterval(
          event.operationId,
          setInterval(() => {
            this.service.emit(ScheduleIntegrationEvents.Load, {
              operationId: event.operationId,
            });
          }, event.interval),
        );
        return;
      case ScheduleType.Timeout:
        this.schedulerRegistry.addTimeout(
          event.operationId,
          setTimeout(() => {
            this.service.emit(ScheduleIntegrationEvents.Load, {
              operationId: event.operationId,
            });
          }, event.interval),
        );
        return;
      default:
        this.logger.debug('not sure what to do with this event');
        return;
    }
  }
}
