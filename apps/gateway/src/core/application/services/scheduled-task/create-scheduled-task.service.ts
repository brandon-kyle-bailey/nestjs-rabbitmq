import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { CreateScheduledTaskCommand } from 'apps/gateway/src/interface/commands/scheduled-task/create-scheduled-task.command';
import { ScheduledTaskEntity } from '../../../domain/entities/scheduled-task.entity';
import { ScheduledTaskRepository } from '../../ports/scheduled-task/scheduled-task.repository';
import { ScheduledTaskRepositoryPort } from '../../ports/scheduled-task/scheduled-task.repository.port';
import { WorkspaceRepository } from '../../ports/workspace/workspace.repository';
import { WorkspaceRepositoryPort } from '../../ports/workspace/workspace.repository.port';

@CommandHandler(CreateScheduledTaskCommand)
export class CreateScheduledTaskService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduledTaskRepository)
    protected readonly repo: ScheduledTaskRepositoryPort,
    @Inject(UserRepository)
    protected readonly userRepo: UserRepositoryPort,
    @Inject(WorkspaceRepository)
    protected readonly workspaceRepo: WorkspaceRepositoryPort,
  ) {}
  async execute(
    command: CreateScheduledTaskCommand,
  ): Promise<ScheduledTaskEntity> {
    try {
      const owner = await this.userRepo.findOneById(command.ownerId);
      const workspace = await this.workspaceRepo.findOneById(
        command.workspaceId,
      );
      const task = ScheduledTaskEntity.create({
        ...command,
        owner,
        workspace,
      });
      await this.repo.transaction(async () => {
        this.repo.insert(task);
      });
      return task;
    } catch (error) {
      this.logger.error(
        'CreateScheduledTaskService.execute encountered an error',
        error,
      );
    }
  }
}
