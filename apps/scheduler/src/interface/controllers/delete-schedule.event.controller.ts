import { HttpService } from '@nestjs/axios';
import { Controller, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { OperationIntegrationEvents } from 'libs/events/operation.events';

// TODO... seperate invoke handler into event processor service

@Controller()
export class DeleteScheduleEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly schedulerRegistry: SchedulerRegistry,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  @EventPattern(OperationIntegrationEvents.Unschedule)
  async delete(
    @Payload() payload: any,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    this.logger.debug('DeleteScheduleEventController.delete called');
    const data = JSON.parse(payload);
    if (
      !this.schedulerRegistry.doesExist(
        'interval',
        `${data.aggregateId}_scheduled_event`,
      )
    ) {
      this.logger.debug('interval does not exist, returning');
      return;
    }
    this.schedulerRegistry.deleteInterval(
      `${data.aggregateId}_scheduled_event`,
    );

    const doestExistAfterDelete = this.schedulerRegistry.doesExist(
      'interval',
      `${data.aggregateId}_scheduled_event`,
    );
    this.logger.debug('Result of delete interval', doestExistAfterDelete);
  }
}
