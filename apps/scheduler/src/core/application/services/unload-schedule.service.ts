import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ScheduleDeletedDomainEvent,
  ScheduleType,
} from '../../domain/entities/schedule.entity';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class UnloadScheduleService {
  constructor(
    protected readonly logger: Logger,
    protected readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @OnEvent(ScheduleDeletedDomainEvent.name, { async: true, promisify: true })
  async handle(event: ScheduleDeletedDomainEvent): Promise<any> {
    this.logger.debug(
      'UnloadScheduleService.handle called with event',
      JSON.stringify(event),
    );
    if (!this.schedulerRegistry.doesExist(event.type, event.operationId)) {
      this.logger.debug(
        `Schedule does not exist for operation ${event.operationId}. Returning`,
      );
      return;
    }
    switch (event.type as ScheduleType) {
      case ScheduleType.Cron:
        this.logger.debug('Cron type not supported yet');
        return;
      case ScheduleType.Interval:
        this.schedulerRegistry.deleteInterval(event.operationId);
        return;
      case ScheduleType.Timeout:
        this.schedulerRegistry.deleteTimeout(event.operationId);
        return;
      default:
        this.logger.debug('not sure what to do with this event');
        return;
    }
  }
}
