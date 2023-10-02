import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OperationEntity } from '../../domain/entities/operation.entity';
import { OperationRepositoryPort } from '../ports/operation/operation.repository.port';
import { OperationRepository } from '../ports/operation/operation.repository';
import { ListOperationsQuery } from 'apps/gateway/src/interface/queries/list-operations.query';
import { Paginated } from 'libs/ports/repository.port';

@QueryHandler(ListOperationsQuery)
export class ListOperationsService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(OperationRepository)
    protected readonly operationRepository: OperationRepositoryPort,
  ) {}
  async execute(
    query: ListOperationsQuery,
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
        'ListOperationsService.execute encountered an error',
        error,
      );
    }
  }
}
