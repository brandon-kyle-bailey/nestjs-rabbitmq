import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetWorkspaceQuery } from 'apps/gateway/src/interface/queries/workspace/get-workspace.query';
import { WorkspaceEntity } from '../../../domain/entities/workspace.entity';
import { WorkspaceRepository } from '../../ports/workspace/workspace.repository';
import { WorkspaceRepositoryPort } from '../../ports/workspace/workspace.repository.port';

@QueryHandler(GetWorkspaceQuery)
export class GetWorkspaceService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(WorkspaceRepository)
    protected readonly repo: WorkspaceRepositoryPort,
  ) {}
  async execute(query: GetWorkspaceQuery): Promise<WorkspaceEntity> {
    try {
      return await this.repo.findOneById(query.id);
    } catch (error) {
      this.logger.error(
        'GetWorkspaceService.execute encountered an error',
        error,
      );
    }
  }
}
