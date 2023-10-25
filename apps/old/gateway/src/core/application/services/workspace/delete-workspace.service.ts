import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteWorkspaceCommand } from 'apps/gateway/src/interface/commands/workspace/delete-workspace.command';
import { AggregateID } from 'libs/ddd/entity.base';
import { WorkspaceRepository } from '../../ports/workspace/workspace.repository';
import { WorkspaceRepositoryPort } from '../../ports/workspace/workspace.repository.port';

@CommandHandler(DeleteWorkspaceCommand)
export class DeleteWorkspaceService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(WorkspaceRepository)
    protected readonly repo: WorkspaceRepositoryPort,
  ) {}
  async execute(command: DeleteWorkspaceCommand): Promise<AggregateID> {
    try {
      await this.repo.transaction(async () => {
        const workspace = await this.repo.findOneById(command.id);
        workspace.delete();
        await this.repo.delete(workspace);
      });
      return command.id;
    } catch (error) {
      this.logger.error(
        'DeleteWorkspaceService.execute encountered an error',
        error,
      );
    }
  }
}
