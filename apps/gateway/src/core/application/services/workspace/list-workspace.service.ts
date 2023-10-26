import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Paginated } from 'libs/ports/repository.port';
import { ListWorkspacesQuery } from 'apps/gateway/src/interface/queries/workspace/list-workspaces.query';
import { WorkspaceRepository } from '../../ports/workspace/workspace.repository';
import { WorkspaceRepositoryPort } from '../../ports/workspace/workspace.repository.port';
import { WorkspaceEntity } from '../../../domain/entities/workspace.entity';

// TODO... only list workspaces the user is a member of

@QueryHandler(ListWorkspacesQuery)
export class ListWorkspacesService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(WorkspaceRepository)
    protected readonly repo: WorkspaceRepositoryPort,
  ) {}
  async execute(
    query: ListWorkspacesQuery,
  ): Promise<Paginated<WorkspaceEntity>> {
    try {
      return await this.repo.findAllPaginated({
        limit: query.limit,
        page: query.page,
        offset: query.offset,
        orderBy: { field: 'createdAt', param: 'asc' },
      });
    } catch (error) {
      this.logger.error(
        'ListWorkspacesService.execute encountered an error',
        error,
      );
    }
  }
}
