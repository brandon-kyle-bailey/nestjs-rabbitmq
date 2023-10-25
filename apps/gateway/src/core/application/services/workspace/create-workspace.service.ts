import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateWorkspaceCommand } from 'apps/gateway/src/interface/commands/workspace/create-workspace.command';
import { WorkspaceEntity } from '../../../domain/entities/workspace.entity';
import { WorkspaceRepository } from '../../ports/workspace/workspace.repository';
import { WorkspaceRepositoryPort } from '../../ports/workspace/workspace.repository.port';
import { UserRepository } from '../../ports/user/user.repository';
import { UserRepositoryPort } from '../../ports/user/user.repository.port';
import { WorkspaceMembershipRepository } from '../../ports/workspace-membership/workspace-membership.repository';
import { WorkspaceMembershipRepositoryPort } from '../../ports/workspace-membership/workspace-membership.repository.port';
import { WorkspaceMembershipEntity } from '../../../domain/entities/workspace-membership.entity';

@CommandHandler(CreateWorkspaceCommand)
export class CreateWorkspaceService implements ICommandHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(WorkspaceRepository)
    protected readonly repo: WorkspaceRepositoryPort,
    @Inject(UserRepository)
    protected readonly userRepo: UserRepositoryPort,
    @Inject(WorkspaceMembershipRepository)
    protected readonly membershipRepo: WorkspaceMembershipRepositoryPort,
  ) {}
  async execute(command: CreateWorkspaceCommand): Promise<WorkspaceEntity> {
    try {
      this.logger.debug('command', JSON.stringify(command));
      const owner = await this.userRepo.findOneById(command.ownerId);
      const workspace = WorkspaceEntity.create({
        name: command.name,
        owner,
      });
      const membership = WorkspaceMembershipEntity.create({
        userId: owner.id,
        user: owner,
        workspaceId: workspace.id,
        workspace,
      });
      await this.repo.transaction(async () => {
        this.repo.insert(workspace);
        this.membershipRepo.insert(membership);
      });
      return workspace;
    } catch (error) {
      this.logger.error(
        'CreateWorkspaceService.execute encountered an error',
        error,
      );
    }
  }
}
