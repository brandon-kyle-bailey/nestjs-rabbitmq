import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OperationIntegrationEvents } from 'libs/events/operation.events';
import { AggregateID } from 'libs/ddd/entity.base';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateScheduleIntervalRequestDto } from '../dtos/schedule/update-schedule-interval.request.dto';
import { UpdateScheduleIntervalCommand } from '../commands/update-schedule-interval.command';

@Controller()
export class UpdateScheduleIntervalEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @EventPattern(OperationIntegrationEvents.UpdateInterval)
  async pause(
    @Payload() payload: UpdateScheduleIntervalRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<AggregateID> {
    try {
      this.logger.debug(
        `UpdateScheduleIntervalEventController.pause invoked with payload`,
        payload,
      );
      const command = UpdateScheduleIntervalCommand.create(payload);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'UpdateScheduleIntervalEventController.pause encountered an error',
        error,
      );
    }
  }
}
