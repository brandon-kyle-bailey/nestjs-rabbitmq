import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Paginated } from 'libs/ports/repository.port';
import { ListWorkspacesQuery } from 'apps/gateway/src/interface/queries/workspace/list-workspaces.query';
import { WorkspaceRepository } from '../../ports/workspace/workspace.repository';
import { WorkspaceRepositoryPort } from '../../ports/workspace/workspace.repository.port';
import { WorkspaceEntity } from '../../../domain/entities/workspace.entity';
import { WorkspaceMembershipRepository } from '../../ports/workspace-membership/workspace-membership.repository';
import { WorkspaceMembershipRepositoryPort } from '../../ports/workspace-membership/workspace-membership.repository.port';
import { In } from 'typeorm';

@QueryHandler(ListWorkspacesQuery)
export class ListWorkspacesService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(WorkspaceRepository)
    protected readonly repo: WorkspaceRepositoryPort,
    @Inject(WorkspaceMembershipRepository)
    protected readonly membershipRepo: WorkspaceMembershipRepositoryPort,
  ) {}
  async execute(
    query: ListWorkspacesQuery,
  ): Promise<Paginated<WorkspaceEntity>> {
    try {
      const memberships = await this.membershipRepo.findAllByUserId(
        query.userId,
      );
      return await this.repo.findAllPaginated({
        limit: query.limit,
        page: query.page,
        offset: query.offset,
        orderBy: { field: 'createdAt', param: 'asc' },
        filter: {
          id: In(
            memberships.map((membership) => {
              const { workspaceId } = membership.getProps();
              return workspaceId;
            }),
          ),
        },
      });
    } catch (error) {
      this.logger.error(
        'ListWorkspacesService.execute encountered an error',
        error,
      );
    }
  }
}
