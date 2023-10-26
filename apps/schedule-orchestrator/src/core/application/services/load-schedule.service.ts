import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ScheduleIntegrationEvents } from 'libs/events/schedule.events';
import { TransportAdapterNames } from 'libs/common/enum/adapters/adapters.enum';
import {
  ScheduleLoadDomainEvent,
  ScheduleType,
} from '../../domain/entities/schedule.entity';

@Injectable()
export class LoadScheduleService implements OnModuleInit, OnModuleDestroy {
  constructor(
    protected readonly logger: Logger,
    @Inject(TransportAdapterNames.TransportTaskRunnerAdapterService)
    protected service: ClientProxy,
    protected readonly schedulerRegistry: SchedulerRegistry,
  ) {}
  async onModuleInit() {
    await this.service.connect();
  }
  async onModuleDestroy() {
    await this.service.close();
  }

  @OnEvent(ScheduleLoadDomainEvent.name, { async: true, promisify: true })
  async handle(event: ScheduleLoadDomainEvent): Promise<void> {
    this.logger.debug(
      'LoadScheduleService.handle called with event',
      JSON.stringify(event),
    );
    if (
      this.schedulerRegistry.doesExist(
        event.type as ScheduleType,
        event.scheduledTaskId,
      )
    ) {
      this.logger.debug(
        `Schedule already exists for operation ${event.scheduledTaskId}. Returning`,
      );
      return;
    }
    switch (event.type as ScheduleType) {
      case ScheduleType.Cron:
        this.logger.debug('Cron type not supported yet');
        return;
      case ScheduleType.Interval:
        this.schedulerRegistry.addInterval(
          event.scheduledTaskId,
          setInterval(() => {
            this.logger.debug(
              `Hello world from schedule ${event.scheduledTaskId}`,
            );
            this.service.emit(ScheduleIntegrationEvents.Load, {
              scheduledTaskId: event.scheduledTaskId,
            });
          }, event.interval),
        );
        return;
      case ScheduleType.Timeout:
        this.schedulerRegistry.addTimeout(
          event.scheduledTaskId,
          setTimeout(() => {
            this.service.emit(ScheduleIntegrationEvents.Load, {
              scheduledTaskId: event.scheduledTaskId,
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
