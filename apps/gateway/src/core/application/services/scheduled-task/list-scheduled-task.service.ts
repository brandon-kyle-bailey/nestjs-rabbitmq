import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListScheduledTaskQuery } from 'apps/gateway/src/interface/queries/scheduled-task/list-scheduled-task.query';
import { Paginated } from 'libs/ports/repository.port';
import { ScheduledTaskEntity } from '../../../domain/entities/scheduled-task.entity';
import { ScheduledTaskRepository } from '../../ports/scheduled-task/scheduled-task.repository';
import { ScheduledTaskRepositoryPort } from '../../ports/scheduled-task/scheduled-task.repository.port';

// TODO... only list scheduled tasks that exist for workspaces the user is a member of

@QueryHandler(ListScheduledTaskQuery)
export class ListScheduledTaskService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduledTaskRepository)
    protected readonly repo: ScheduledTaskRepositoryPort,
  ) {}
  async execute(
    query: ListScheduledTaskQuery,
  ): Promise<Paginated<ScheduledTaskEntity>> {
    try {
      return await this.repo.findAllPaginated({
        limit: query.limit,
        page: query.page,
        offset: query.offset,
        orderBy: { field: 'createdAt', param: 'asc' },
      });
    } catch (error) {
      this.logger.error(
        'ListScheduledTaskService.execute encountered an error',
        error,
      );
    }
  }
}
