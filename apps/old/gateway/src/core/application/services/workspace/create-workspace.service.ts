import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateWorkspaceCommand } from 'apps/gateway/src/interface/commands/workspace/create-workspace.command';
import { WorkspaceEntity } from '../../../domain/entities/workspace.entity';
import { WorkspaceRepository } from '../../ports/workspace/workspace.repository';
import { WorkspaceRepositoryPort } from '../../ports/workspace/workspace.repository.port';

@CommandHandler(CreateWorkspaceCommand)
export class CreateWorkspaceService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(WorkspaceRepository)
    protected readonly repo: WorkspaceRepositoryPort,
  ) {}
  async execute(command: CreateWorkspaceCommand): Promise<WorkspaceEntity> {
    try {
      const workspace = WorkspaceEntity.create({
        name: command.name,
        ownerID: command.ownerID,
      });
      await this.repo.transaction(async () => this.repo.insert(workspace));
      return workspace;
    } catch (error) {
      this.logger.error(
        'CreateWorkspaceService.execute encountered an error',
        error,
      );
    }
  }
}
