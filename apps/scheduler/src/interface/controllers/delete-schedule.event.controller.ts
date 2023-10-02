import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OperationIntegrationEvents } from 'libs/events/operation.events';
import { DeleteScheduleRequestDto } from '../dtos/schedule/delete-schedule.request.dto';
import { AggregateID } from 'libs/ddd/entity.base';
import { DeleteScheduleCommand } from '../commands/delete-schedule.command';
import { CommandBus } from '@nestjs/cqrs';

@Controller()
export class DeleteScheduleEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @EventPattern(OperationIntegrationEvents.Unschedule)
  async delete(
    @Payload() payload: DeleteScheduleRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<AggregateID> {
    try {
      this.logger.debug(
        `DeleteScheduleEventController.delete invoked with payload`,
        payload,
      );
      const command = DeleteScheduleCommand.create(payload);
      const result = await this.commandBus.execute(command);
      return result;
    } catch (error) {
      this.logger.error(
        'DeleteScheduleEventController.delete encountered an error',
        error,
      );
    }
  }
}
