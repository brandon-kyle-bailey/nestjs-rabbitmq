import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { Payload } from '@nestjs/microservices';
import { TaskCreatedDomainEvent } from '../../core/domain/entities/task.entity';
import { PromoteTaskResultToIncidentWatcherRequestDto } from '../dtos/promote-task-result-to-incident-watcher.request.dto';
import { PromoteTaskResultToIncidentWatcherCommand } from '../commands/promote-task-result-to-incident-watcher.command';

@Controller()
export class PromoteTaskResultToIncidentWatcherEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @OnEvent(TaskCreatedDomainEvent.name)
  async create(
    @Payload() payload: PromoteTaskResultToIncidentWatcherRequestDto,
  ): Promise<void> {
    try {
      const command = PromoteTaskResultToIncidentWatcherCommand.create(payload);
      await this.commandBus.execute(command);
    } catch (error) {
      this.logger.error(
        'PromoteTaskResultToIncidentWatcherEventController.create encountered an error',
        error,
      );
    }
  }
}
