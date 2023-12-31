import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OperationEntity } from '../../../domain/entities/operation.entity';
import { OperationRepositoryPort } from '../../ports/operation/operation.repository.port';
import { OperationRepository } from '../../ports/operation/operation.repository';
import { Paginated } from 'libs/ports/repository.port';
import { ListWorkspacesQuery } from 'apps/gateway/src/interface/queries/workspace/list-workspaces.query';

@QueryHandler(ListWorkspacesQuery)
export class ListWorkspacesService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(OperationRepository)
    protected readonly operationRepository: OperationRepositoryPort,
  ) {}
  async execute(
    query: ListWorkspacesQuery,
  ): Promise<Paginated<OperationEntity>> {
    try {
      return await this.operationRepository.findAllPaginated({
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
