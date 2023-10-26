import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateScheduledTaskCommand } from 'apps/gateway/src/interface/commands/scheduled-task/update-scheduled-task.command';
import { ScheduledTaskEntity } from '../../../domain/entities/scheduled-task.entity';
import { ScheduledTaskRepository } from '../../ports/scheduled-task/scheduled-task.repository';
import { ScheduledTaskRepositoryPort } from '../../ports/scheduled-task/scheduled-task.repository.port';

@CommandHandler(UpdateScheduledTaskCommand)
export class UpdateScheduledTaskService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduledTaskRepository)
    protected readonly repo: ScheduledTaskRepositoryPort,
  ) {}
  async execute(
    command: UpdateScheduledTaskCommand,
  ): Promise<ScheduledTaskEntity> {
    try {
      let scheduledTask: ScheduledTaskEntity;
      await this.repo.transaction(async () => {
        scheduledTask = await this.repo.findOneById(command.id);
        if (!scheduledTask.isOwner(command.userId)) {
          throw new UnauthorizedException(
            'user does not have permission to update this resource',
          );
        }
        scheduledTask.update(command);
        this.repo.save(scheduledTask);
      });
      return scheduledTask;
    } catch (error) {
      this.logger.error(
        'UpdateScheduledTaskService.execute encountered an error',
        error,
      );
    }
  }
}
