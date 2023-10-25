import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OperationEntity } from '../../../domain/entities/operation.entity';
import { OperationRepositoryPort } from '../../ports/operation/operation.repository.port';
import { OperationRepository } from '../../ports/operation/operation.repository';
import { GetOperationQuery } from 'apps/gateway/src/interface/queries/operation/get-operation.query';

@QueryHandler(GetOperationQuery)
export class GetOperationService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(OperationRepository)
    protected readonly operationRepository: OperationRepositoryPort,
  ) {}
  async execute(query: GetOperationQuery): Promise<OperationEntity> {
    try {
      return await this.operationRepository.findOneById(query.id);
    } catch (error) {
      this.logger.error(
        'GetOperationService.execute encountered an error',
        error,
      );
    }
  }
}
