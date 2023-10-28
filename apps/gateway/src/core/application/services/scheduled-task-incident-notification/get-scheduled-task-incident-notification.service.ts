import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetScheduledTaskIncidentNotificationQuery } from 'apps/gateway/src/interface/queries/scheduled-task-incident-notification/get-scheduled-task-incident-notification.query';
import { ScheduledTaskIncidentNotificationEntity } from '../../../domain/entities/scheduled-task-incident-notification.entity';
import { ScheduledTaskIncidentNotificationRepository } from '../../ports/scheduled-task-incident-notification/scheduled-task-incident-notification.repository';
import { ScheduledTaskIncidentNotificationRepositoryPort } from '../../ports/scheduled-task-incident-notification/scheduled-task-incident-notification.repository.port';

@QueryHandler(GetScheduledTaskIncidentNotificationQuery)
export class GetScheduledTaskIncidentNotificationService
  implements IQueryHandler
{
  constructor(
    private readonly logger: Logger,
    @Inject(ScheduledTaskIncidentNotificationRepository)
    protected readonly repo: ScheduledTaskIncidentNotificationRepositoryPort,
  ) {}
  async execute(
    query: GetScheduledTaskIncidentNotificationQuery,
  ): Promise<ScheduledTaskIncidentNotificationEntity> {
    try {
      return await this.repo.findOneById(query.id);
    } catch (error) {
      this.logger.error(
        'GetScheduledTaskIncidentNotificationService.execute encountered an error',
        error,
      );
    }
  }
}
