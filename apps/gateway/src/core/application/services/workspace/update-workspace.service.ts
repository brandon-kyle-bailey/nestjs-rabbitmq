import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateWorkspaceCommand } from 'apps/gateway/src/interface/commands/workspace/update-workspace.command';
import { WorkspaceEntity } from '../../../domain/entities/workspace.entity';
import { WorkspaceRepository } from '../../ports/workspace/workspace.repository';
import { WorkspaceRepositoryPort } from '../../ports/workspace/workspace.repository.port';

@CommandHandler(UpdateWorkspaceCommand)
export class UpdateWorkspaceService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(WorkspaceRepository)
    protected readonly repo: WorkspaceRepositoryPort,
  ) {}
  async execute(command: UpdateWorkspaceCommand): Promise<WorkspaceEntity> {
    try {
      let workspace: WorkspaceEntity;
      await this.repo.transaction(async () => {
        workspace = await this.repo.findOneById(command.id);
        // Workspace.update(command);
        this.repo.save(workspace);
      });
      return workspace;
    } catch (error) {
      this.logger.error(
        'UpdateWorkspaceService.execute encountered an error',
        error,
      );
    }
  }
}
