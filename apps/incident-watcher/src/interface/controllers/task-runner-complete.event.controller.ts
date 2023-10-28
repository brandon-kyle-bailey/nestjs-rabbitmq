import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { TaskIntegrationEvents } from 'libs/events/task.events';
import { TaskRunnerCompleteEventDto } from '../dtos/task-runner-complete.event.dto';
import { VerifyScheduledTaskIncidentCommand } from '../commands/verify-scheduled-task-incident.command';

@Controller()
export class TaskRunnerCompleteEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @EventPattern(TaskIntegrationEvents.Complete)
  async handle(
    @Payload() payload: TaskRunnerCompleteEventDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      this.logger.debug(
        'TaskRunnerCompleteEventController.handle executed with payload',
      );
      const command = VerifyScheduledTaskIncidentCommand.create(payload);
      const result = await this.commandBus.execute(command);
    } catch (error) {
      this.logger.error(
        'TaskRunnerCompleteEventController.handle encountered an error',
        error,
      );
    }
  }
}
