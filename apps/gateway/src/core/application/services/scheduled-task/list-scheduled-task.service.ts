import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListScheduledTaskQuery } from 'apps/gateway/src/interface/queries/scheduled-task/list-scheduled-task.query';
import { Paginated } from 'libs/ports/repository.port';
import { ScheduledTaskEntity } from '../../../domain/entities/scheduled-task.entity';
import { ScheduledTaskRepository } from '../../ports/scheduled-task/scheduled-task.repository';
import { ScheduledTaskRepositoryPort } from '../../ports/scheduled-task/scheduled-task.repository.port';
import { WorkspaceMembershipRepository } from '../../ports/workspace-membership/workspace-membership.repository';
import { WorkspaceMembershipRepositoryPort } from '../../ports/workspace-membership/workspace-membership.repository.port';
import { In } from 'typeorm';

@QueryHandler(ListScheduledTaskQuery)
export class ListScheduledTaskService implements IQueryHandler {
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduledTaskRepository)
    protected readonly repo: ScheduledTaskRepositoryPort,
    @Inject(WorkspaceMembershipRepository)
    protected readonly workspaceMembershipRepo: WorkspaceMembershipRepositoryPort,
  ) {}
  async execute(
    query: ListScheduledTaskQuery,
  ): Promise<Paginated<ScheduledTaskEntity>> {
    try {
      const workspaceMemberships =
        await this.workspaceMembershipRepo.findAllByUserId(query.userId);
      return await this.repo.findAllPaginated({
        limit: query.limit,
        page: query.page,
        offset: query.offset,
        orderBy: { field: 'createdAt', param: 'asc' },
        filter: {
          workspaceId: In(
            workspaceMemberships.map((membership) => {
              const { workspaceId } = membership.getProps();
              return workspaceId;
            }),
          ),
        },
      });
    } catch (error) {
      this.logger.error(
        'ListScheduledTaskService.execute encountered an error',
        error,
      );
    }
  }
}
