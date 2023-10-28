import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';
import { Payload } from '@nestjs/microservices';
import { TaskCreatedDomainEvent } from '../../core/domain/entities/task.entity';
import { PublishTaskResultRequestDto } from '../dtos/publish-task-result.request.dto';
import { PublishTaskResultCommand } from '../commands/publish-task-result.command';

@Controller()
export class PublishTaskResultEventController {
  constructor(
    protected readonly logger: Logger,
    protected readonly commandBus: CommandBus,
  ) {}

  @OnEvent(TaskCreatedDomainEvent.name)
  async create(@Payload() payload: PublishTaskResultRequestDto): Promise<void> {
    try {
      const command = PublishTaskResultCommand.create(payload);
      await this.commandBus.execute(command);
    } catch (error) {
      this.logger.error(
        'PublishTaskResultEventController.create encountered an error',
        error,
      );
    }
  }
}
