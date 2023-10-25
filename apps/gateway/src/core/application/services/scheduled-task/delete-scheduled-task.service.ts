import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteScheduledTaskCommand } from 'apps/gateway/src/interface/commands/scheduled-task/delete-scheduled-task.command';
import { AggregateID } from 'libs/ddd/entity.base';
import { ScheduledTaskRepository } from '../../ports/scheduled-task/scheduled-task.repository';
import { ScheduledTaskRepositoryPort } from '../../ports/scheduled-task/scheduled-task.repository.port';

@CommandHandler(DeleteScheduledTaskCommand)
export class DeleteScheduledTaskService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduledTaskRepository)
    protected readonly repo: ScheduledTaskRepositoryPort,
  ) {}
  async execute(command: DeleteScheduledTaskCommand): Promise<AggregateID> {
    try {
      await this.repo.transaction(async () => {
        const task = await this.repo.findOneById(command.id);
        task.delete();
        await this.repo.delete(task);
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'DeleteScheduledTaskService.execute encountered an error',
        error,
      );
    }
  }
}
