import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllByScheduledTaskIdNotifyStatusPrefixQuery } from 'apps/gateway/src/interface/queries/scheduled-task-incident-notification/find-all-by-scheduled-task-id-notify-status-prefix.query';
import { ScheduledTaskIncidentNotificationEntity } from '../../../domain/entities/scheduled-task-incident-notification.entity';
import { ScheduledTaskIncidentNotificationRepository } from '../../ports/scheduled-task-incident-notification/scheduled-task-incident-notification.repository';
import { ScheduledTaskIncidentNotificationRepositoryPort } from '../../ports/scheduled-task-incident-notification/scheduled-task-incident-notification.repository.port';

@QueryHandler(FindAllByScheduledTaskIdNotifyStatusPrefixQuery)
export class FindAllByScheduledTaskIdNotifyStatusPrefixService
  implements IQueryHandler
{
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduledTaskIncidentNotificationRepository)
    protected readonly repo: ScheduledTaskIncidentNotificationRepositoryPort,
  ) {}
  async execute(
    query: FindAllByScheduledTaskIdNotifyStatusPrefixQuery,
  ): Promise<ScheduledTaskIncidentNotificationEntity[]> {
    try {
      return await this.repo.findAllByScheduledTaskIdAndStatusPrefix(
        query.scheduledTaskId,
        query.statusPrefix,
      );
    } catch (error) {
      this.logger.error(
        'FindAllByScheduledTaskIdNotifyStatusPrefixService.execute encountered an error',
        error,
      );
    }
  }
}
