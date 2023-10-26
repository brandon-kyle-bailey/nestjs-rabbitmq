import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ScheduledTaskIntegrationEvents } from 'libs/events/scheduled-task.events';
import { RunTaskRequestDto } from '../dtos/run-task.request.dto';
import { TaskResponseDto } from '../dtos/task.response.dto';
import { RunTaskCommand } from '../commands/run-task.command';
import { TaskMapper } from '../../infrastructure/mappers/task.mapper';

@Controller()
export class RunTaskEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
    protected readonly mapper: TaskMapper,
  ) {}

  @EventPattern(ScheduledTaskIntegrationEvents.RunTask)
  async create(
    @Payload() payload: RunTaskRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<TaskResponseDto> {
    try {
      const command = RunTaskCommand.create({
        scheduledTaskId: payload.scheduledTaskId,
        protocol: payload.protocol,
        host: payload.host,
        port: payload.port,
        payload: payload.payload,
      });
      const result = await this.commandBus.execute(command);
      return this.mapper.toResponse(result);
    } catch (error) {
      this.logger.error(
        'RunTaskEventController.create encountered an error',
        error,
      );
    }
  }
}
