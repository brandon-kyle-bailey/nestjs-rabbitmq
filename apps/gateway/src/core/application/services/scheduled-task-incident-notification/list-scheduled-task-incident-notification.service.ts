import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListScheduledTaskIncidentNotificationQuery } from 'apps/gateway/src/interface/queries/scheduled-task-incident-notification/list-scheduled-task-incident-notification.query';
import { Paginated } from 'libs/ports/repository.port';
import { ScheduledTaskIncidentNotificationEntity } from '../../../domain/entities/scheduled-task-incident-notification.entity';
import { ScheduledTaskIncidentNotificationRepository } from '../../ports/scheduled-task-incident-notification/scheduled-task-incident-notification.repository';
import { ScheduledTaskIncidentNotificationRepositoryPort } from '../../ports/scheduled-task-incident-notification/scheduled-task-incident-notification.repository.port';

@QueryHandler(ListScheduledTaskIncidentNotificationQuery)
export class ListScheduledTaskIncidentNotificationService
  implements IQueryHandler
{
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduledTaskIncidentNotificationRepository)
    protected readonly repo: ScheduledTaskIncidentNotificationRepositoryPort,
  ) {}
  async execute(
    query: ListScheduledTaskIncidentNotificationQuery,
  ): Promise<Paginated<ScheduledTaskIncidentNotificationEntity>> {
    try {
      return await this.repo.findAllPaginated({
        limit: query.limit,
        page: query.page,
        offset: query.offset,
        orderBy: { field: 'createdAt', param: 'asc' },
      });
    } catch (error) {
      this.logger.error(
        'ListScheduledTaskIncidentNotificationsService.execute encountered an error',
        error,
      );
    }
  }
}
