import { Inject, Logger } from '@nestjs/common';
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
      let ScheduledTask: ScheduledTaskEntity;
      await this.repo.transaction(async () => {
        ScheduledTask = await this.repo.findOneById(command.id);
        // ScheduledTask.update(command);
        this.repo.save(ScheduledTask);
      });
      return ScheduledTask;
    } catch (error) {
      this.logger.error(
        'UpdateScheduledTaskService.execute encountered an error',
        error,
      );
    }
  }
}
