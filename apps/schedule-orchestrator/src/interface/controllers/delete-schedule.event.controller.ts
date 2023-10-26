import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AggregateID } from 'libs/ddd/entity.base';
import { CommandBus } from '@nestjs/cqrs';
import { ScheduledTaskIntegrationEvents } from 'libs/events/scheduled-task.events';
import { DeleteScheduleRequestDto } from '../dtos/delete-schedule.request.dto';
import { DeleteScheduleCommand } from '../commands/delete-schedule.command';

@Controller()
export class DeleteScheduleEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @EventPattern(ScheduledTaskIntegrationEvents.DeleteSchedule)
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
      return;
    } catch (error) {
      this.logger.error(
        'DeleteScheduleEventController.delete encountered an error',
        error,
      );
    }
  }
}
