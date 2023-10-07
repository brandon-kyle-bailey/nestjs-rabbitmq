import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OperationIntegrationEvents } from 'libs/events/operation.events';
import { AggregateID } from 'libs/ddd/entity.base';
import { CommandBus } from '@nestjs/cqrs';
import { PauseScheduleCommand } from '../commands/pause-schedule.command';
import { PauseScheduleRequestDto } from '../dtos/schedule/pause-schedule.request.dto';

@Controller()
export class PauseScheduleEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @EventPattern(OperationIntegrationEvents.Pause)
  async pause(
    @Payload() payload: PauseScheduleRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<AggregateID> {
    try {
      this.logger.debug(
        `PauseScheduleEventController.pause invoked with payload`,
        payload,
      );
      const command = PauseScheduleCommand.create(payload);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'PauseScheduleEventController.pause encountered an error',
        error,
      );
    }
  }
}
