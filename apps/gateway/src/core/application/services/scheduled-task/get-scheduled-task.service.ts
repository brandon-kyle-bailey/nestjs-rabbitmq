import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetScheduledTaskQuery } from 'apps/gateway/src/interface/queries/scheduled-task/get-scheduled-task.query';
import { ScheduledTaskEntity } from '../../../domain/entities/scheduled-task.entity';
import { ScheduledTaskRepository } from '../../ports/scheduled-task/scheduled-task.repository';
import { ScheduledTaskRepositoryPort } from '../../ports/scheduled-task/scheduled-task.repository.port';

@QueryHandler(GetScheduledTaskQuery)
export class GetScheduledTaskService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduledTaskRepository)
    protected readonly repo: ScheduledTaskRepositoryPort,
  ) {}
  async execute(query: GetScheduledTaskQuery): Promise<ScheduledTaskEntity> {
    try {
      return await this.repo.findOneById(query.id);
    } catch (error) {
      this.logger.error(
        'GetScheduledTaskService.execute encountered an error',
        error,
      );
    }
  }
}
